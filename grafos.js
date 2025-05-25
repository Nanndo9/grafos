/**
 * Represents an element in the adjacency list.
 * Each element contains an adjacent vertex, the weight of the edge,
 * and a reference to the next element in the list.
 */
class ElemLista {
    constructor(verticeAdjacente, peso) {
        this.verticeAdjacente = verticeAdjacente; // Number of the adjacent vertex
        this.peso = peso;                         // Weight of the edge connecting to the vertex
        this.proximo = null;                      // Reference to the next element in the list
    }
}

/**
 * Represents an edge in the graph.
 * Contains source vertex, destination vertex, and the weight of the edge.
 */
class Aresta {
    constructor(verticeOrigem, verticeDestino, peso) {
        this.verticeOrigem = verticeOrigem;     // Vertex from where the edge starts
        this.verticeDestino = verticeDestino;   // Vertex where the edge ends
        this.peso = peso;                       // Weight of the edge
    }

    // For sorting, we'll use a compare function directly with Array.sort()
    // instead of operator overloading.
}

/**
 * Implementation of the Union-Find (Disjoint Set) structure.
 * Used in Kruskal's algorithm for cycle detection.
 * Implements path compression and union by rank (height).
 */
class DisjointSet {
    constructor(numElementos) {
        this.ancestral = new Array(numElementos);
        this.altura = new Array(numElementos).fill(0);
        for (let indice = 0; indice < numElementos; indice++) {
            this.ancestral[indice] = indice; // Each element is initially its own ancestor
        }
    }

    /**
     * Finds the representative (root) of the set containing the element.
     * Uses path compression for optimization.
     */
    encontrarRepresentante(elemento) {
        if (this.ancestral[elemento] !== elemento) {
            this.ancestral[elemento] = this.encontrarRepresentante(this.ancestral[elemento]); // Path compression
        }
        return this.ancestral[elemento];
    }

    /**
     * Unites the sets containing elements A and B.
     * Uses union by rank to keep the tree balanced.
     */
    unirConjuntos(elementoA, elementoB) {
        let raizA = this.encontrarRepresentante(elementoA);
        let raizB = this.encontrarRepresentante(elementoB);

        if (raizA === raizB) return; // Already in the same set

        // Union by rank - the tree with smaller rank becomes a subtree of the one with larger rank
        if (this.altura[raizA] < this.altura[raizB]) {
            this.ancestral[raizA] = raizB;
        } else {
            this.ancestral[raizB] = raizA;
            if (this.altura[raizA] === this.altura[raizB]) {
                this.altura[raizA]++; // Increment rank if both have the same rank
            }
        }
    }
}

/**
 * Main class implementing a graph using adjacency lists.
 * Supports directed/undirected and weighted/unweighted graphs.
 * Contains implementations of various classic graph algorithms.
 */
class Grafo {
    constructor(vertices, direcionado = false, ponderado = true) {
        this.numVertices = vertices;
        this.numArestas = 0;
        this.direcionado = direcionado;
        this.ponderado = ponderado;

        // Initialize adjacency list
        this.listaAdjacencia = new Array(vertices);
        for (let i = 0; i < vertices; i++) {
            this.listaAdjacencia[i] = null;
        }
        this.INFINITO = 999999; // Represents infinity for distances
    }


    insereArestaAux(verticeOrigem, verticeDestino, peso) {
        let anterior = null;
        let corrente = this.listaAdjacencia[verticeOrigem];

        while (corrente !== null && corrente.verticeAdjacente < verticeDestino) {
            anterior = corrente;
            corrente = corrente.proximo;
        }

        if (corrente !== null && corrente.verticeAdjacente === verticeDestino) {
            return false;
        }

        const novoElemento = new ElemLista(verticeDestino, peso);
        novoElemento.proximo = corrente;

        if (anterior !== null) {
            anterior.proximo = novoElemento;
        } else {
            this.listaAdjacencia[verticeOrigem] = novoElemento;
        }
        return true;
    }
    adicionaAresta(verticeOrigem, verticeDestino, peso) {
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices ||
            verticeOrigem === verticeDestino) {
            console.log("Entrada invalida");
            return;
        }

        const pesoReal = this.ponderado ? peso : 1;

        if (this.insereArestaAux(verticeOrigem, verticeDestino, pesoReal)) {
            if (!this.direcionado) {
                this.insereArestaAux(verticeDestino, verticeOrigem, pesoReal); // Add reverse edge
            }
            this.numArestas++;
        }
    }

    adicionaArestaDirecionada(verticeOrigem, verticeDestino, peso) {
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices ||
            verticeOrigem === verticeDestino) {
            console.log("Entrada invalida");
            return;
        }

        const pesoReal = this.ponderado ? peso : 1;

        if (this.insereArestaAux(verticeOrigem, verticeDestino, pesoReal)) {
            this.numArestas++;
        }
    }

    algoritmoBFS(verticeInicial) {
        const distancias = new Array(this.numVertices).fill(this.INFINITO);
        const visitado = new Array(this.numVertices).fill(false);
        const fila = [];

        distancias[verticeInicial] = 0;
        visitado[verticeInicial] = true;
        fila.push(verticeInicial);

        while (fila.length > 0) {
            const u = fila.shift();

            let vizinho = this.listaAdjacencia[u];
            while (vizinho !== null) {
                const w = vizinho.verticeAdjacente;
                if (!visitado[w]) {
                    visitado[w] = true;
                    distancias[w] = distancias[u] + 1;
                    fila.push(w);
                }
                vizinho = vizinho.proximo;
            }
        }

        console.log(`\nDistancias a partir do vertice ${verticeInicial} (usando BFS):`);
        for (let i = 1; i < this.numVertices; i++) {
            if (distancias[i] === this.INFINITO)
                console.log(`Vertice ${i}: INFINITO`);
            else
                console.log(`Vertice ${i}: ${distancias[i]}`);
        }
    }

    algoritmoDijkstra(verticeInicial) {
        const distancias = new Array(this.numVertices).fill(this.INFINITO);
        const visitado = new Array(this.numVertices).fill(false);

        distancias[verticeInicial] = 0;

        for (let contador = 0; contador < this.numVertices - 1; contador++) {
            let verticeAtual = -1;
            let menorDistancia = this.INFINITO;

            for (let indiceVertice = 0; indiceVertice < this.numVertices; indiceVertice++) {
                if (!visitado[indiceVertice] && distancias[indiceVertice] < menorDistancia) {
                    menorDistancia = distancias[indiceVertice];
                    verticeAtual = indiceVertice;
                }
            }

            if (verticeAtual === -1) {
                break; 
            }

            visitado[verticeAtual] = true;

            let vizinho = this.listaAdjacencia[verticeAtual];
            while (vizinho !== null) {
                const verticeVizinho = vizinho.verticeAdjacente;
                const pesoAresta = vizinho.peso;

                if (!visitado[verticeVizinho] &&
                    distancias[verticeAtual] !== this.INFINITO && // Check if verticeAtual is reachable
                    distancias[verticeAtual] + pesoAresta < distancias[verticeVizinho]) {
                    distancias[verticeVizinho] = distancias[verticeAtual] + pesoAresta;
                }
                vizinho = vizinho.proximo;
            }
        }

        console.log(`\nDistancias a partir do vertice ${verticeInicial} (usando Dijkstra):`);
        for (let i = 1; i < this.numVertices; i++) {
            if (distancias[i] === this.INFINITO)
                console.log(`Vertice ${i}: INFINITO`);
            else
                console.log(`Vertice ${i}: ${distancias[i]}`);
        }
    }

    algoritmoFloyd() {
        const dist = Array.from({ length: this.numVertices }, () =>
            new Array(this.numVertices).fill(this.INFINITO)
        );

        for (let i = 0; i < this.numVertices; i++) {
            dist[i][i] = 0;
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                dist[i][atual.verticeAdjacente] = atual.peso;
                atual = atual.proximo;
            }
        }

        for (let k = 0; k < this.numVertices; k++) {
            for (let i = 0; i < this.numVertices; i++) {
                for (let j = 0; j < this.numVertices; j++) {
                    if (dist[i][k] !== this.INFINITO && dist[k][j] !== this.INFINITO &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }

        console.log("\nMatriz de distancias minimas (Floyd-Warshall):");
        for (let i = 0; i < this.numVertices; i++) {
            let linha = "";
            for (let j = 0; j < this.numVertices; j++) {
                if (dist[i][j] === this.INFINITO)
                    linha += "INF\t";
                else
                    linha += dist[i][j] + "\t";
            }
            console.log(linha);
        }
    }

    algoritmoKruskal() {
        const todasArestas = [];

        for (let vertice = 0; vertice < this.numVertices; vertice++) {
            let corrente = this.listaAdjacencia[vertice];
            while (corrente !== null) {
                if (!this.direcionado && vertice < corrente.verticeAdjacente) {
                    todasArestas.push(new Aresta(vertice, corrente.verticeAdjacente, corrente.peso));
                } else if (this.direcionado) {
                    todasArestas.push(new Aresta(vertice, corrente.verticeAdjacente, corrente.peso));
                }
                corrente = corrente.proximo;
            }
        }

        todasArestas.sort((a, b) => a.peso - b.peso);

        const conjuntosDisjuntos = new DisjointSet(this.numVertices);
        const arvoreGeradoraMinima = [];
        let custoTotal = 0;

        for (const aresta of todasArestas) {
            if (conjuntosDisjuntos.encontrarRepresentante(aresta.verticeOrigem) !==
                conjuntosDisjuntos.encontrarRepresentante(aresta.verticeDestino)) {
                arvoreGeradoraMinima.push(aresta);
                conjuntosDisjuntos.unirConjuntos(aresta.verticeOrigem, aresta.verticeDestino);
                custoTotal += aresta.peso;
            }
        }

        console.log("\nArvore Geradora Minima (Kruskal):");
        console.log("Arestas na MST:");
        for (const aresta of arvoreGeradoraMinima) {
            console.log(`${aresta.verticeOrigem} -- ${aresta.verticeDestino} (peso: ${aresta.peso})`);
        }
        console.log(`Custo total da MST: ${custoTotal}`);
    }

    algoritmoPrim() {
        const chave = new Array(this.numVertices).fill(this.INFINITO);
        const naArvore = new Array(this.numVertices).fill(false);
        const pai = new Array(this.numVertices).fill(-1);


        const verticeInicialPrim = 1; // Escolha um vértice inicial válido do seu grafo (ex: 1)
        if (verticeInicialPrim < 0 || verticeInicialPrim >= this.numVertices) {
        console.error("Vértice inicial inválido para Prim.");
        return;
    }
    chave[verticeInicialPrim] = 0;

        for (let i = 0; i < this.numVertices - 1; i++) { 
            let u = -1;
            let menorChave = this.INFINITO;
            for (let v = 0; v < this.numVertices; v++) {
                if (!naArvore[v] && chave[v] < menorChave) {
                    menorChave = chave[v];
                    u = v;
                }
            }

            if (u === -1) break; 
            naArvore[u] = true;

            let adj = this.listaAdjacencia[u];
            while (adj !== null) {
                const v = adj.verticeAdjacente;
                const peso = adj.peso;
                if (!naArvore[v] && peso < chave[v]) {
                    pai[v] = u;
                    chave[v] = peso;
                }
                adj = adj.proximo;
            }
        }

        let custoTotal = 0;
        console.log("\nArvore Geradora Minima (Prim):");
        console.log("Arestas na MST:");
        for (let i = 1; i < this.numVertices; i++) {
            if (pai[i] !== -1) {
                let pesoAresta = this.INFINITO;
                let adj = this.listaAdjacencia[pai[i]];
                while (adj !== null) {
                    if (adj.verticeAdjacente === i) {
                        pesoAresta = adj.peso;
                        break;
                    }
                    adj = adj.proximo;
                }
                if (pesoAresta === this.INFINITO) {
                    adj = this.listaAdjacencia[i];
                    while (adj !== null) {
                        if (adj.verticeAdjacente === pai[i]) {
                            pesoAresta = adj.peso;
                            break;
                        }
                        adj = adj.proximo;
                    }
                }


                if (pai[i] !== -1 && pesoAresta !== this.INFINITO) {
                    console.log(`${pai[i]} -- ${i} (peso: ${pesoAresta})`);
                    custoTotal += pesoAresta;
                } else if (pai[i] !== -1) { 
                    console.log(`${pai[i]} -- ${i} (peso desconhecido, using key value: ${chave[i]})`);
                    custoTotal += chave[i];
                }
            }
        }
        let custoCalculadoPrim = 0;
        for (let i = 0; i < this.numVertices; i++) {
            if (pai[i] !== -1) { 
                let adj = this.listaAdjacencia[pai[i]];
                let foundWeight = -1;
                while (adj) {
                    if (adj.verticeAdjacente === i) {
                        foundWeight = adj.peso;
                        break;
                    }
                    adj = adj.proximo;
                }
                if (foundWeight !== -1) {
                    custoCalculadoPrim += foundWeight;
                } else if (!this.direcionado) {
                    adj = this.listaAdjacencia[i];
                    while (adj) {
                        if (adj.verticeAdjacente === pai[i]) {
                            foundWeight = adj.peso;
                            break;
                        }
                        adj = adj.proximo;
                    }
                    if (foundWeight !== -1) {
                        custoCalculadoPrim += foundWeight;
                    }
                }
            }
        }
        console.log(`Custo total da MST: ${custoCalculadoPrim}`);
    }

    dfsUtil(v, visitado) {
        visitado[v] = true;
        let atual = this.listaAdjacencia[v];
        while (atual !== null) {
            if (!visitado[atual.verticeAdjacente]) {
                this.dfsUtil(atual.verticeAdjacente, visitado);
            }
            atual = atual.proximo;
        }
    }

    estaConectadoDFS() {
        if (this.numVertices === 0) return true; 
        const visitado = new Array(this.numVertices).fill(false);
        this.dfsUtil(0, visitado); 

        for (let i = 0; i < this.numVertices; i++) {
            if (!visitado[i]) {
                if (!this.listaAdjacencia[i] && this.numVertices > 1) {
                    let isIsolated = true;
                    for (let j = 0; j < this.numVertices; j++) {
                        if (i === j) continue;
                        if (this.arestaExiste(i, j) || this.arestaExiste(j, i)) {
                            isIsolated = false;
                            break;
                        }
                    }
                    if (isIsolated) return false; 
                } else if (!visitado[i]) {
                    return false;
                }
            }
        }
        return true;
    }


    
    algoritmoApagaReverso() {
        if (this.direcionado) {
            console.log("\nAlgoritmo Apaga Reverso eh tipicamente para grafos nao direcionados.");
            // return; // Or proceed with caution
        }

        let arestas = [];
        for (let i = 0; i < this.numVertices; i++) {
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                // Only add once for undirected graphs
                if (i < atual.verticeAdjacente || this.direcionado) {
                    arestas.push(new Aresta(i, atual.verticeAdjacente, atual.peso));
                }
                atual = atual.proximo;
            }
        }

        // Sort edges by weight (descending)
        arestas.sort((a, b) => b.peso - a.peso);

        let mstEdges = [];
        for (let i = 0; i < this.numVertices; i++) {
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                if (i < atual.verticeAdjacente || this.direcionado) { // Avoid duplicates for undirected
                    mstEdges.push(new Aresta(i, atual.verticeAdjacente, atual.peso));
                }
                atual = atual.proximo;
            }
        }
        mstEdges.sort((a, b) => b.peso - a.peso); // Sort all current edges descending by weight


        // Iterate through sorted edges (heaviest first)
        for (let i = 0; i < arestas.length; i++) {
            const aresta = arestas[i];

            // Temporarily remove the edge
            const originalEdgeWasPresent = this.removeAresta(aresta.verticeOrigem, aresta.verticeDestino, true /* forApagaReverso */);

            if (originalEdgeWasPresent) {
                if (!this.estaConectadoDFS()) {
                    // If disconnected, the edge is essential: add it back
                    this.adicionaAresta(aresta.verticeOrigem, aresta.verticeDestino, aresta.peso);
                } else {
                    // If still connected, the edge was successfully removed from the MST candidate.
                    // numArestas was already decremented by removeAresta
                }
            }
        }

        console.log("\nResultado do algoritmo Apaga Reverso (MST):");
        this.exibeGrafo(); // Display the graph which now represents the MST
        let custoTotal = 0;
        for (let i = 0; i < this.numVertices; i++) {
            let temp = this.listaAdjacencia[i];
            while (temp != null) {
                // For undirected, count each edge once by convention (e.g. when i < temp.verticeAdjacente)
                if (!this.direcionado && i < temp.verticeAdjacente) {
                    custoTotal += temp.peso;
                } else if (this.direcionado) {
                    custoTotal += temp.peso;
                }
                temp = temp.proximo;
            }
        }
        console.log(`Custo total da MST (Apaga Reverso): ${custoTotal}`);
    }


    ordenarArestas(crescente) {
        let arestas = [];
        for (let i = 0; i < this.numVertices; i++) {
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                // Avoid duplication in undirected graphs if this.direcionado is false
                if (this.direcionado || i < atual.verticeAdjacente) {
                    arestas.push(new Aresta(i, atual.verticeAdjacente, atual.peso));
                }
                atual = atual.proximo;
            }
        }

        if (crescente) {
            arestas.sort((a, b) => a.peso - b.peso);
            console.log("\nArestas ordenadas por peso (crescente):");
        } else {
            arestas.sort((a, b) => b.peso - a.peso);
            console.log("\nArestas ordenadas por peso (decrescente):");
        }

        for (const aresta of arestas) {
            console.log(`${aresta.verticeOrigem} -- ${aresta.verticeDestino} (peso: ${aresta.peso})`);
        }
    }

    removeArestaAux(verticeOrigem, verticeDestino) {
        let anterior = null;
        let corrente = this.listaAdjacencia[verticeOrigem];

        while (corrente !== null && corrente.verticeAdjacente < verticeDestino) {
            anterior = corrente;
            corrente = corrente.proximo;
        }

        if (corrente !== null && corrente.verticeAdjacente === verticeDestino) {
            if (anterior !== null) {
                anterior.proximo = corrente.proximo;
            } else {
                this.listaAdjacencia[verticeOrigem] = corrente.proximo;
            }
            // No manual memory deallocation like 'delete corrente' in JS
            return true;
        }
        return false; // Edge not found
    }
    removeAresta(verticeOrigem, verticeDestino, forApagaReverso = false) {
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices ||
            verticeOrigem === verticeDestino) {
            if (!forApagaReverso) console.log("Entrada invalida para remocao");
            return false;
        }

        let removed = this.removeArestaAux(verticeOrigem, verticeDestino);
        if (removed) {
            if (!this.direcionado) {
                this.removeArestaAux(verticeDestino, verticeOrigem);
            }
           
            if (!forApagaReverso || (forApagaReverso && this.arestaExiste(verticeOrigem, verticeDestino, true))) {
                //The check above is a bit complex. Simpler: if primary removal happened, count it.
            }
          
            this.numArestas--; // Decrement if the primary direction was removed
            return true;
        }
        return false;
    }
    exibeGrafo() {
        console.log("\n=== REPRESENTACAO DO GRAFO (LISTA DE ADJACENCIA) ===");
        for (let i = 1; i < this.numVertices; i++) {
            let temp = this.listaAdjacencia[i];
            let output = `Vertice ${i} -> `;
            while (temp !== null) {
                output += `(${temp.verticeAdjacente}, peso: ${temp.peso})`;
                if (temp.proximo !== null)
                    output += " -> ";
                temp = temp.proximo;
            }
            console.log(output);
        }
    }

    arestaExiste(verticeOrigem, verticeDestino, suppressMessage = false) {
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices) {
            // Removed verticeOrigem === verticeDestino check as self-loops can exist
            if (!suppressMessage) console.log("Entrada invalida para arestaExiste");
            return false;
        }

        let atual = this.listaAdjacencia[verticeOrigem];
        while (atual !== null && atual.verticeAdjacente < verticeDestino) {
            atual = atual.proximo;
        }

        return atual !== null && atual.verticeAdjacente === verticeDestino;
    }

    // Destructor (~Grafo) is not needed in JavaScript due to automatic garbage collection.
}

/**
 * Creates an example graph based on the specified type.
 * Adds edges corresponding to the examples in the prompt.
 */
function criarGrafoExemplo(g, grafoDirecionado, grafoPonderado) {
    // Limpa o grafo antes de adicionar novas arestas
    // (isso não existe no código atual, seria necessário implementar)

    if (grafoDirecionado) {
        if (grafoPonderado) {
            // Grafo direcionado ponderado
            g.adicionaArestaDirecionada(1, 2, 3);
            g.adicionaArestaDirecionada(1, 3, 1);
            g.adicionaArestaDirecionada(3, 2, 5);
        } else {
            // Grafo direcionado não ponderado
            g.adicionaArestaDirecionada(1, 2, 1);
            g.adicionaArestaDirecionada(1, 3, 1);
            g.adicionaArestaDirecionada(3, 2, 1);
        }
    } else { // Grafos não direcionados
        if (grafoPonderado) {
            // Grafo não direcionado ponderado
            g.adicionaAresta(1, 2, 3);
            g.adicionaAresta(1, 3, 1);
            g.adicionaAresta(3, 2, 5);
        } else {
            g.adicionaAresta(1, 2, 1);
            g.adicionaAresta(1, 3, 1);
            g.adicionaAresta(3, 2, 1);
        }
    }
}


/**
 * Função principal com menu interativo.
 * Implementa um menu semelhante ao do código C++ original.
 */
async function main() {
    // Configuração para leitura interativa de entrada do usuário
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));
    console.log("=== CONFIGURAÇÃO DO GRAFO ===");
    let resposta = await askQuestion("O grafo sera direcionado? (s/n): ");
    const grafoEhDirecionado = resposta.toLowerCase() === 's';

    resposta = await askQuestion("O grafo sera ponderado? (s/n): ");
    const grafoEhPonderado = resposta.toLowerCase() === 's';

    // Cria um grafo com 5 vértices
    const numVertices = 4;
    const grafo = new Grafo(numVertices, grafoEhDirecionado, grafoEhPonderado);

    // Preenche o grafo com arestas de exemplo
    criarGrafoExemplo(grafo, grafoEhDirecionado, grafoEhPonderado);

    let programaEncerrado = false;

    while (!programaEncerrado) {
        // Exibe o menu de opções
        console.log("\n=== MENU DE OPERACOES DO GRAFOS ===");
        console.log("01. Lista de adjacencia de grafos nao direcionados");
        console.log("02. Lista de adjacencia de grafos direcionados");
        console.log("03. Menor caminho de grafos direcionados");
        console.log("04. Menor caminho de grafos direcionados ponderados");
        console.log("05. Menor caminho de grafos nao direcionados");
        console.log("06. Menor caminho de grafos nao direcionados ponderados");
        console.log("07. Arvore geradora minima - Kruskal");
        console.log("08. Arvore geradora minima - Prim");
        console.log("09. Arvore geradora minima - ApagaReverso");
        console.log("10. Ordenacao de arestas por peso (crescente/decrescente)");
        console.log("11. Sair");

        const opcaoMenu = parseInt(await askQuestion("Escolha uma opcao: "));

        // Processa a opção escolhida
        switch (opcaoMenu) {
            case 1: // Lista de adjacência de grafos não direcionados
                if (!grafoEhDirecionado) {
                    console.log("\n=== LISTA DE ADJACENCIA DE GRAFOS NÃO DIRECIONADOS ===");
                    grafo.exibeGrafo();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados!");
                }
                break;

            case 2: // Lista de adjacência de grafos direcionados
                if (grafoEhDirecionado) {
                    console.log("\n=== LISTA DE ADJACENCIA DE GRAFOS DIRECIONADOS ===");
                    grafo.exibeGrafo();
                } else {
                    console.log("Esta opcao so pode ser utilizada em grafos direcionados!");
                }
                break;

            case 3: // Menor caminho in directed, unweighted graphs (BFS)
                if (grafoEhDirecionado && !grafoEhPonderado) {
                    console.log("\n=== MENOR CAMINHO DE GRAFOS DIRECIONADOS NAO PONDERADOS (utilizando BFS) ===");
                    const verticeInicial = parseInt(await askQuestion("Digite o vertice inicial: "));
                    grafo.algoritmoBFS(verticeInicial);
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos direcionados nao ponderados!");
                }
                break;

            case 4: // Menor caminho in directed, weighted graphs (Dijkstra and Floyd)
                if (grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== MENOR CAMINHO DE GRAFOS DIRECIONADOS PONDERADOS ===");
                    console.log("Utilizando Dijkstra: ");
                    const verticeInicial = parseInt(await askQuestion("Digite o vertice inicial: "));
                    grafo.algoritmoDijkstra(verticeInicial);
                    grafo.algoritmoFloyd();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos direcionados ponderados!");
                }
                break;

            case 5: // Menor caminho in undirected, unweighted graphs (BFS)
                if (!grafoEhDirecionado && !grafoEhPonderado) {
                    console.log("\n=== MENOR CAMINHO DE GRAFOS NAO DIRECIONADOS NAO PONDERADOS (utilizando BFS)===");
                    const verticeInicial = parseInt(await askQuestion("Digite o vertice inicial: "));
                    grafo.algoritmoBFS(verticeInicial);
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados nao ponderados!");
                }
                break;

            case 6: // Menor caminho in undirected, weighted graphs (Dijkstra and Floyd)
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== MENOR CAMINHO DE GRAFOS NAO DIRECIONADOS PONDERADOS ===");
                    console.log("Utilizando Dijkstra: ");
                    const verticeInicial = parseInt(await askQuestion("Digite o vertice inicial: "));
                    grafo.algoritmoDijkstra(verticeInicial);
                    grafo.algoritmoFloyd();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 7: // Minimum Spanning Tree - Kruskal
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== ARVORE GERADORA MINIMA - KRUSKAL ===");
                    grafo.algoritmoKruskal();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 8: // Minimum Spanning Tree - Prim
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== ARVORE GERADORA MINIMA - PRIM ===");
                    grafo.algoritmoPrim();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 9: // Minimum Spanning Tree - Reverse Delete
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== ARVORE GERADORA MINIMA - APAGA REVERSO ===");
                    grafo.algoritmoApagaReverso();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 10: // Sorting edges by weight
                resposta = await askQuestion("Ordenar em ordem (c)rescente ou (d)ecrescente? ");
                grafo.ordenarArestas(resposta.toLowerCase() === 'c');
                break;

            case 11: // Exit the program
                console.log("Encerrando programa...");
                programaEncerrado = true;
                break;

            default: // Invalid option
                console.log("Opção invalida! Tente novamente.");
                break;
        }
    }

    rl.close();
    console.log("Programa encerrado.");
}

// Executa a função principal se estiver em Node.js
if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
    main().catch(console.error);
} else {
    console.log("Este menu interativo é otimizado para execução em Node.js");
}