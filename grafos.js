
class ElemLista {
    constructor(verticeAdjacente, peso) {
        this.verticeAdjacente = verticeAdjacente; // Vértice de destino da aresta
        this.peso = peso;                         // Peso da aresta que conecta ao vértice
        this.proximo = null;                      // Referência ao próximo elemento na lista encadeada
    }
}

/**
 * Classe Aresta
 * Representa uma aresta no grafo.
 * Contém vértice de origem, vértice de destino e o peso da aresta.
 * Usada principalmente para operações que manipulam diretamente arestas,
 * como algoritmos de árvore geradora mínima (Kruskal, Prim, Apaga Reverso).
 */
class Aresta {
    constructor(verticeOrigem, verticeDestino, peso) {
        this.verticeOrigem = verticeOrigem;     // Vértice de onde a aresta começa
        this.verticeDestino = verticeDestino;   // Vértice onde a aresta termina
        this.peso = peso;                       // Peso da aresta
    }
    // Para ordenação, usamos uma função de comparação diretamente com Array.sort()
}

/**
 * Classe DisjointSet (Union-Find)
 * Implementação da estrutura Union-Find (Conjuntos Disjuntos).
 * Usada no algoritmo de Kruskal para detecção de ciclos.
 * Implementa compressão de caminho e união por altura (rank).
 * 
 * Complexidade:
 * - Quase constante amortizada para operações find e union
 * - Inicialização: O(n) onde n é o número de elementos
 */
class DisjointSet {
    constructor(numElementos) {
        this.ancestral = new Array(numElementos); // Array para armazenar o ancestral de cada elemento
        this.altura = new Array(numElementos).fill(0); // Array para armazenar a altura de cada árvore

        // Inicialmente, cada elemento é seu próprio ancestral (conjuntos separados)
        for (let indice = 0; indice < numElementos; indice++) {
            this.ancestral[indice] = indice;
        }
    }

    /**
     * Encontra o representante (raiz) do conjunto que contém o elemento.
     * Usa compressão de caminho para otimização.
     * 
     * Complexidade: O(α(n)) - onde α é a função inversa de Ackermann, praticamente constante
     * 
     * @param {number} elemento - O elemento para encontrar seu representante
     * @returns {number} O representante do conjunto
     */
    encontrarRepresentante(elemento) {
        if (this.ancestral[elemento] !== elemento) {
            // Compressão de caminho: atualiza ancestral para apontar diretamente para a raiz
            this.ancestral[elemento] = this.encontrarRepresentante(this.ancestral[elemento]);
        }
        return this.ancestral[elemento];
    }

    /**
     * Une os conjuntos que contêm os elementos A e B.
     * Usa união por altura para manter a árvore balanceada.
     * 
     * Complexidade: O(α(n)) - praticamente constante
     * 
     * @param {number} elementoA - Primeiro elemento
     * @param {number} elementoB - Segundo elemento
     */
    unirConjuntos(elementoA, elementoB) {
        let raizA = this.encontrarRepresentante(elementoA);
        let raizB = this.encontrarRepresentante(elementoB);

        if (raizA === raizB) return; // Já estão no mesmo conjunto

        // União por altura - a árvore com menor altura se torna uma subárvore da outra
        if (this.altura[raizA] < this.altura[raizB]) {
            this.ancestral[raizA] = raizB;
        } else {
            this.ancestral[raizB] = raizA;
            // Se ambas têm a mesma altura, incrementa a altura da resultante
            if (this.altura[raizA] === this.altura[raizB]) {
                this.altura[raizA]++;
            }
        }
    }
}

/**
 * Classe Grafo
 * Implementação principal de um grafo usando listas de adjacência.
 * Suporta grafos direcionados/não direcionados e ponderados/não ponderados.
 * Contém implementações de vários algoritmos clássicos de grafos.
 */
class Grafo {
    /**
     * Construtor da classe Grafo
     * 
     * @param {number} vertices - Número de vértices no grafo
     * @param {boolean} direcionado - Se o grafo é direcionado (true) ou não (false)
     * @param {boolean} ponderado - Se o grafo é ponderado (true) ou não (false)
     */
    constructor(vertices, direcionado = false, ponderado = true) {
        this.numVertices = vertices;          // Número total de vértices
        this.numArestas = 0;                  // Número total de arestas
        this.direcionado = direcionado;       // Flag para grafo direcionado
        this.ponderado = ponderado;           // Flag para grafo ponderado

        // Inicializa a lista de adjacência
        this.listaAdjacencia = new Array(vertices);
        for (let i = 0; i < vertices; i++) {
            this.listaAdjacencia[i] = null;
        }
        this.INFINITO = 999999; // Representa infinito para distâncias
    }

    /**
     * Método auxiliar para inserir uma aresta na lista de adjacência.
     * Mantém a lista ordenada por vértice adjacente.
     * 
     * Complexidade: O(grau do vértice) no pior caso
     * 
     * @param {number} verticeOrigem - Vértice de origem
     * @param {number} verticeDestino - Vértice de destino
     * @param {number} peso - Peso da aresta
     * @returns {boolean} true se a aresta foi inserida, false se já existia
     */
    insereArestaAux(verticeOrigem, verticeDestino, peso) {
        let anterior = null;
        let corrente = this.listaAdjacencia[verticeOrigem];

        // Encontra a posição correta para inserir a aresta mantendo a ordenação
        while (corrente !== null && corrente.verticeAdjacente < verticeDestino) {
            anterior = corrente;
            corrente = corrente.proximo;
        }

        // Verifica se a aresta já existe
        if (corrente !== null && corrente.verticeAdjacente === verticeDestino) {
            return false;
        }

        // Cria um novo elemento e o insere na lista
        const novoElemento = new ElemLista(verticeDestino, peso);
        novoElemento.proximo = corrente;

        if (anterior !== null) {
            anterior.proximo = novoElemento;
        } else {
            this.listaAdjacencia[verticeOrigem] = novoElemento;
        }
        return true;
    }

    /**
     * Adiciona uma aresta ao grafo.
     * Se o grafo não for direcionado, adiciona também a aresta reversa.
     * 
     * @param {number} verticeOrigem - Vértice de origem
     * @param {number} verticeDestino - Vértice de destino
     * @param {number} peso - Peso da aresta (padrão é 1 para grafos não ponderados)
     */
    adicionaAresta(verticeOrigem, verticeDestino, peso) {
        // Validação dos vértices
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices ||
            verticeOrigem === verticeDestino) {
            console.log("Entrada invalida");
            return;
        }

        const pesoReal = this.ponderado ? peso : 1;

        // Insere a aresta e, se bem-sucedido, incrementa o contador
        if (this.insereArestaAux(verticeOrigem, verticeDestino, pesoReal)) {
            if (!this.direcionado) {
                // Para grafos não direcionados, adiciona a aresta reversa
                this.insereArestaAux(verticeDestino, verticeOrigem, pesoReal);
            }
            this.numArestas++;
        }
    }

    /**
     * Adiciona uma aresta direcionada ao grafo, independentemente da configuração.
     * Útil para criar grafos mistos ou para testes específicos.
     * 
     * @param {number} verticeOrigem - Vértice de origem
     * @param {number} verticeDestino - Vértice de destino
     * @param {number} peso - Peso da aresta
     */
    adicionaArestaDirecionada(verticeOrigem, verticeDestino, peso) {
        // Validação dos vértices
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices ||
            verticeOrigem === verticeDestino) {
            console.log("Entrada invalida");
            return;
        }

        const pesoReal = this.ponderado ? peso : 1;

        // Insere a aresta direcionada
        if (this.insereArestaAux(verticeOrigem, verticeDestino, pesoReal)) {
            this.numArestas++;
        }
    }

    /**
     * Implementação do algoritmo de Busca em Largura (BFS) para encontrar caminhos mais curtos.
     * Ideal para grafos não ponderados, onde cada aresta tem peso unitário.
     * 
     * Complexidade: O(V + E) onde V é o número de vértices e E é o número de arestas
     * 
     * @param {number} verticeInicial - Vértice de início da busca
     */
    algoritmoBFS(verticeInicial) {
        const distancias = new Array(this.numVertices).fill(this.INFINITO);
        const visitado = new Array(this.numVertices).fill(false);
        const fila = [];

        // Inicializa o vértice inicial
        distancias[verticeInicial] = 0;
        visitado[verticeInicial] = true;
        fila.push(verticeInicial);

        // Processo de BFS
        while (fila.length > 0) {
            const u = fila.shift(); // Remove o primeiro elemento da fila

            // Visita todos os vizinhos do vértice atual
            let vizinho = this.listaAdjacencia[u];
            while (vizinho !== null) {
                const w = vizinho.verticeAdjacente;
                if (!visitado[w]) {
                    visitado[w] = true;
                    distancias[w] = distancias[u] + 1; // Incrementa a distância
                    fila.push(w);
                }
                vizinho = vizinho.proximo;
            }
        }

        // Exibe os resultados
        console.log(`\nDistancias a partir do vertice ${verticeInicial} (usando BFS):`);
        for (let i = 1; i < this.numVertices; i++) {
            if (distancias[i] === this.INFINITO)
                console.log(`Vertice ${i}: INFINITO`);
            else
                console.log(`Vertice ${i}: ${distancias[i]}`);
        }
    }

    /**
     * Implementação do algoritmo de Dijkstra para encontrar caminhos mais curtos.
     * Funciona para grafos ponderados com pesos não-negativos.
     * 
     * Complexidade: O(V²) nesta implementação simples
     * Com fila de prioridade, seria O((V+E)logV)
     * 
     * @param {number} verticeInicial - Vértice de início da busca
     */
    algoritmoDijkstra(verticeInicial) {
        const distancias = new Array(this.numVertices).fill(this.INFINITO);
        const visitado = new Array(this.numVertices).fill(false);

        // Inicializa a distância do vértice inicial como 0
        distancias[verticeInicial] = 0;

        // Para cada vértice, encontramos o vértice não visitado com menor distância
        // e atualizamos as distâncias de seus vizinhos
        for (let contador = 0; contador < this.numVertices - 1; contador++) {
            let verticeAtual = -1;
            let menorDistancia = this.INFINITO;

            // Encontra o vértice não visitado com menor distância atual
            for (let indiceVertice = 0; indiceVertice < this.numVertices; indiceVertice++) {
                if (!visitado[indiceVertice] && distancias[indiceVertice] < menorDistancia) {
                    menorDistancia = distancias[indiceVertice];
                    verticeAtual = indiceVertice;
                }
            }

            // Se não encontrarmos um vértice alcançável, paramos
            if (verticeAtual === -1) {
                break;
            }

            visitado[verticeAtual] = true;

            // Atualiza as distâncias dos vizinhos do vértice atual
            let vizinho = this.listaAdjacencia[verticeAtual];
            while (vizinho !== null) {
                const verticeVizinho = vizinho.verticeAdjacente;
                const pesoAresta = vizinho.peso;

                // Relaxamento: se encontrarmos um caminho mais curto, atualizamos a distância
                if (!visitado[verticeVizinho] &&
                    distancias[verticeAtual] !== this.INFINITO &&
                    distancias[verticeAtual] + pesoAresta < distancias[verticeVizinho]) {
                    distancias[verticeVizinho] = distancias[verticeAtual] + pesoAresta;
                }
                vizinho = vizinho.proximo;
            }
        }

        // Exibe os resultados
        console.log(`\nDistancias a partir do vertice ${verticeInicial} (usando Dijkstra):`);
        for (let i = 1; i < this.numVertices; i++) {
            if (distancias[i] === this.INFINITO)
                console.log(`Vertice ${i}: INFINITO`);
            else
                console.log(`Vertice ${i}: ${distancias[i]}`);
        }
    }

    /**
     * Implementação do algoritmo de Floyd-Warshall para encontrar todos os caminhos mais curtos.
     * Funciona para qualquer grafo, incluindo aqueles com pesos negativos (desde que não haja ciclos negativos).
     * 
     * Complexidade: O(V³) onde V é o número de vértices
     */
    algoritmoFloyd() {
        // Inicializa a matriz de distâncias
        const dist = Array.from({ length: this.numVertices }, () =>
            new Array(this.numVertices).fill(this.INFINITO)
        );

        // Preenche a matriz com as distâncias iniciais
        for (let i = 0; i < this.numVertices; i++) {
            dist[i][i] = 0; // Distância de um vértice para ele mesmo é 0

            // Adiciona as arestas diretas
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                dist[i][atual.verticeAdjacente] = atual.peso;
                atual = atual.proximo;
            }
        }

        // Algoritmo de Floyd-Warshall principal
        // Para cada vértice k, verifica se passar por k melhora o caminho de i para j
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

        // Exibe a matriz de distâncias
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

    /**
     * Implementação do algoritmo de Kruskal para encontrar a Árvore Geradora Mínima (MST).
     * Usa a estrutura Union-Find para detectar ciclos.
     * 
     * Complexidade: O(E log E) onde E é o número de arestas, devido à ordenação
     */
    algoritmoKruskal() {
        const todasArestas = [];

        // Coleta todas as arestas do grafo
        for (let vertice = 0; vertice < this.numVertices; vertice++) {
            let corrente = this.listaAdjacencia[vertice];
            while (corrente !== null) {
                // Para grafos não direcionados, adiciona cada aresta apenas uma vez
                if (!this.direcionado && vertice < corrente.verticeAdjacente) {
                    todasArestas.push(new Aresta(vertice, corrente.verticeAdjacente, corrente.peso));
                } else if (this.direcionado) {
                    todasArestas.push(new Aresta(vertice, corrente.verticeAdjacente, corrente.peso));
                }
                corrente = corrente.proximo;
            }
        }

        // Ordena as arestas por peso (crescente)
        todasArestas.sort((a, b) => a.peso - b.peso);

        // Inicializa a estrutura Union-Find
        const conjuntosDisjuntos = new DisjointSet(this.numVertices);
        const arvoreGeradoraMinima = [];
        let custoTotal = 0;

        // Processa as arestas em ordem crescente de peso
        for (const aresta of todasArestas) {
            // Verifica se adicionar a aresta não forma ciclo
            if (conjuntosDisjuntos.encontrarRepresentante(aresta.verticeOrigem) !==
                conjuntosDisjuntos.encontrarRepresentante(aresta.verticeDestino)) {
                // Adiciona a aresta à MST
                arvoreGeradoraMinima.push(aresta);
                // Une os conjuntos
                conjuntosDisjuntos.unirConjuntos(aresta.verticeOrigem, aresta.verticeDestino);
                custoTotal += aresta.peso;
            }
        }

        // Exibe os resultados
        console.log("\nArvore Geradora Minima (Kruskal):");
        console.log("Arestas na MST:");
        for (const aresta of arvoreGeradoraMinima) {
            console.log(`${aresta.verticeOrigem} -- ${aresta.verticeDestino} (peso: ${aresta.peso})`);
        }
        console.log(`Custo total da MST: ${custoTotal}`);
    }

    /**
     * Implementação do algoritmo de Prim para encontrar a Árvore Geradora Mínima (MST).
     * Cresce a MST a partir de um vértice inicial, sempre adicionando a aresta de menor peso.
     * 
     * Complexidade: O(V²) nesta implementação simples
     * Com fila de prioridade, seria O((V+E)logV)
     */
    algoritmoPrim() {
        const chave = new Array(this.numVertices).fill(this.INFINITO);
        const naArvore = new Array(this.numVertices).fill(false);
        const pai = new Array(this.numVertices).fill(-1);

        // Escolhe um vértice inicial
        const verticeInicialPrim = 1;
        if (verticeInicialPrim < 0 || verticeInicialPrim >= this.numVertices) {
            console.error("Vértice inicial inválido para Prim.");
            return;
        }
        chave[verticeInicialPrim] = 0;

        // Algoritmo principal de Prim
        for (let i = 0; i < this.numVertices - 1; i++) {
            // Encontra o vértice com valor mínimo de chave, não incluído na MST
            let u = -1;
            let menorChave = this.INFINITO;
            for (let v = 0; v < this.numVertices; v++) {
                if (!naArvore[v] && chave[v] < menorChave) {
                    menorChave = chave[v];
                    u = v;
                }
            }

            if (u === -1) break; // Não há mais vértices conectáveis
            naArvore[u] = true;

            // Atualiza os valores de chave e pai dos vértices adjacentes
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

        // Calcula e exibe o resultado
        console.log("\nArvore Geradora Minima (Prim):");
        console.log("Arestas na MST:");

        let custoCalculadoPrim = 0;
        for (let i = 0; i < this.numVertices; i++) {
            if (pai[i] !== -1) {
                // Encontra o peso real da aresta (pai[i] -> i)
                let adj = this.listaAdjacencia[pai[i]];
                let foundWeight = -1;

                // Procura na lista de adjacência
                while (adj) {
                    if (adj.verticeAdjacente === i) {
                        foundWeight = adj.peso;
                        break;
                    }
                    adj = adj.proximo;
                }

                // Se não encontrou e o grafo é não direcionado, procura na outra direção
                if (foundWeight === -1 && !this.direcionado) {
                    adj = this.listaAdjacencia[i];
                    while (adj) {
                        if (adj.verticeAdjacente === pai[i]) {
                            foundWeight = adj.peso;
                            break;
                        }
                        adj = adj.proximo;
                    }
                }

                // Exibe a aresta encontrada
                if (foundWeight !== -1) {
                    console.log(`${pai[i]} -- ${i} (peso: ${foundWeight})`);
                    custoCalculadoPrim += foundWeight;
                }
            }
        }
        console.log(`Custo total da MST: ${custoCalculadoPrim}`);
    }

    /**
     * Função auxiliar para DFS (Busca em Profundidade)
     * Usada para verificar se o grafo está conectado.
     * 
     * @param {number} v - Vértice atual
     * @param {Array<boolean>} visitado - Array de vértices visitados
     */
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

    /**
     * Verifica se o grafo está conectado usando DFS.
     * Um grafo está conectado se existe um caminho entre cada par de vértices.
     * 
     * Complexidade: O(V + E)
     * 
     * @returns {boolean} true se o grafo está conectado, false caso contrário
     */
    estaConectadoDFS() {
        if (this.numVertices === 0) return true;
        const visitado = new Array(this.numVertices).fill(false);

        // Começa a DFS a partir do vértice 0
        this.dfsUtil(0, visitado);

        // Verifica se todos os vértices foram visitados
        for (let i = 0; i < this.numVertices; i++) {
            if (!visitado[i]) {
                // Verifica se é um vértice isolado
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

    /**
     * Implementação do algoritmo Apaga Reverso para encontrar a Árvore Geradora Mínima.
     * Ao contrário de Kruskal e Prim que adicionam arestas, este algoritmo remove arestas
     * em ordem decrescente de peso, desde que não desconecte o grafo.
     * 
     * Complexidade: O(E²) no pior caso, devido às verificações de conectividade
     */
    algoritmoApagaReverso() {
        if (this.direcionado) {
            console.log("\nAlgoritmo Apaga Reverso eh tipicamente para grafos nao direcionados.");
        }

        // Coleta todas as arestas do grafo
        let arestas = [];
        for (let i = 0; i < this.numVertices; i++) {
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                // Adiciona cada aresta apenas uma vez para grafos não direcionados
                if (i < atual.verticeAdjacente || this.direcionado) {
                    arestas.push(new Aresta(i, atual.verticeAdjacente, atual.peso));
                }
                atual = atual.proximo;
            }
        }

        // Ordena as arestas por peso (decrescente)
        arestas.sort((a, b) => b.peso - a.peso);

        // Duplica as arestas para manter uma cópia de referência
        let mstEdges = [];
        for (let i = 0; i < this.numVertices; i++) {
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                if (i < atual.verticeAdjacente || this.direcionado) {
                    mstEdges.push(new Aresta(i, atual.verticeAdjacente, atual.peso));
                }
                atual = atual.proximo;
            }
        }
        mstEdges.sort((a, b) => b.peso - a.peso); // Ordena por peso decrescente

        // Itera pelas arestas ordenadas (mais pesadas primeiro)
        for (let i = 0; i < arestas.length; i++) {
            const aresta = arestas[i];

            // Remove temporariamente a aresta
            const originalEdgeWasPresent = this.removeAresta(aresta.verticeOrigem, aresta.verticeDestino, true);

            if (originalEdgeWasPresent) {
                // Verifica se o grafo continua conectado após a remoção
                if (!this.estaConectadoDFS()) {
                    // Se desconectado, a aresta é essencial: adiciona de volta
                    this.adicionaAresta(aresta.verticeOrigem, aresta.verticeDestino, aresta.peso);
                }
                // Se ainda conectado, a aresta foi removida com sucesso da MST candidata
            }
        }

        // Exibe o resultado
        console.log("\nResultado do algoritmo Apaga Reverso (MST):");
        this.exibeGrafo();

        // Calcula o custo total
        let custoTotal = 0;
        for (let i = 0; i < this.numVertices; i++) {
            let temp = this.listaAdjacencia[i];
            while (temp != null) {
                // Para grafos não direcionados, conta cada aresta uma vez por convenção
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

    /**
     * Ordena e exibe as arestas do grafo por peso.
     * 
     * @param {boolean} crescente - true para ordenar em ordem crescente, false para decrescente
     */
    ordenarArestas(crescente) {
        // Coleta todas as arestas
        let arestas = [];
        for (let i = 0; i < this.numVertices; i++) {
            let atual = this.listaAdjacencia[i];
            while (atual !== null) {
                // Evita duplicação em grafos não direcionados
                if (this.direcionado || i < atual.verticeAdjacente) {
                    arestas.push(new Aresta(i, atual.verticeAdjacente, atual.peso));
                }
                atual = atual.proximo;
            }
        }

        // Ordena e exibe as arestas
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

    /**
     * Método auxiliar para remover uma aresta da lista de adjacência.
     * 
     * @param {number} verticeOrigem - Vértice de origem
     * @param {number} verticeDestino - Vértice de destino
     * @returns {boolean} true se a aresta foi removida, false se não existia
     */
    removeArestaAux(verticeOrigem, verticeDestino) {
        let anterior = null;
        let corrente = this.listaAdjacencia[verticeOrigem];

        // Encontra a aresta na lista
        while (corrente !== null && corrente.verticeAdjacente < verticeDestino) {
            anterior = corrente;
            corrente = corrente.proximo;
        }

        // Se encontrou a aresta, remove-a
        if (corrente !== null && corrente.verticeAdjacente === verticeDestino) {
            if (anterior !== null) {
                anterior.proximo = corrente.proximo;
            } else {
                this.listaAdjacencia[verticeOrigem] = corrente.proximo;
            }
            // Em JavaScript, o coletor de lixo cuida da desalocação de memória
            return true;
        }
        return false; // Aresta não encontrada
    }

    /**
     * Remove uma aresta do grafo.
     * Se o grafo não for direcionado, remove também a aresta reversa.
     * 
     * @param {number} verticeOrigem - Vértice de origem
     * @param {number} verticeDestino - Vértice de destino
     * @param {boolean} forApagaReverso - Flag para indicar se é chamado pelo algoritmo Apaga Reverso
     * @returns {boolean} true se a aresta foi removida, false caso contrário
     */
    removeAresta(verticeOrigem, verticeDestino, forApagaReverso = false) {
        // Validação dos vértices
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices ||
            verticeOrigem === verticeDestino) {
            if (!forApagaReverso) console.log("Entrada invalida para remocao");
            return false;
        }

        // Remove a aresta
        let removed = this.removeArestaAux(verticeOrigem, verticeDestino);
        if (removed) {
            // Para grafos não direcionados, remove também a aresta reversa
            if (!this.direcionado) {
                this.removeArestaAux(verticeDestino, verticeOrigem);
            }

            // Decrementa o contador de arestas
            this.numArestas--;
            return true;
        }
        return false;
    }

    /**
     * Exibe a representação do grafo (lista de adjacência).
     */
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

    /**
     * Verifica se existe uma aresta entre dois vértices.
     * 
     * @param {number} verticeOrigem - Vértice de origem
     * @param {number} verticeDestino - Vértice de destino
     * @param {boolean} suppressMessage - Se true, suprime mensagens de erro
     * @returns {boolean} true se a aresta existe, false caso contrário
     */
    arestaExiste(verticeOrigem, verticeDestino, suppressMessage = false) {
        // Validação dos vértices
        if (verticeOrigem < 0 || verticeDestino < 0 ||
            verticeOrigem >= this.numVertices || verticeDestino >= this.numVertices) {
            if (!suppressMessage) console.log("Entrada invalida para arestaExiste");
            return false;
        }

        // Procura a aresta na lista de adjacência
        let atual = this.listaAdjacencia[verticeOrigem];
        while (atual !== null && atual.verticeAdjacente < verticeDestino) {
            atual = atual.proximo;
        }

        return atual !== null && atual.verticeAdjacente === verticeDestino;
    }
}

/**
 * Cria um grafo de exemplo com base no tipo especificado.
 * Adiciona arestas correspondentes aos exemplos no prompt.
 * 
 * @param {Grafo} g - O grafo a ser preenchido
 * @param {boolean} grafoDirecionado - Se o grafo é direcionado
 * @param {boolean} grafoPonderado - Se o grafo é ponderado
 */
function criarGrafoExemplo(g, grafoDirecionado, grafoPonderado) {
    // Adiciona arestas com base no tipo de grafo
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
            // Grafo não direcionado não ponderado
            g.adicionaAresta(1, 2, 1);
            g.adicionaAresta(1, 3, 1);
            g.adicionaAresta(3, 2, 1);
        }
    }
}

/**
 * Função principal com menu interativo.
 * Implementa um menu para interagir com o grafo e executar os algoritmos.
 */
async function main() {
    // Configuração para leitura interativa de entrada do usuário
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Função auxiliar para fazer perguntas ao usuário
    const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

    // Configuração inicial do grafo
    console.log("=== CONFIGURAÇÃO DO GRAFO ===");
    let resposta = await askQuestion("O grafo sera direcionado? (s/n): ");
    const grafoEhDirecionado = resposta.toLowerCase() === 's';

    resposta = await askQuestion("O grafo sera ponderado? (s/n): ");
    const grafoEhPonderado = resposta.toLowerCase() === 's';

    // Cria um grafo com 4 vértices (0 a 3)
    const numVertices = 4;
    const grafo = new Grafo(numVertices, grafoEhDirecionado, grafoEhPonderado);

    // Preenche o grafo com arestas de exemplo
    criarGrafoExemplo(grafo, grafoEhDirecionado, grafoEhPonderado);

    let programaEncerrado = false;

    // Loop principal do menu
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

        // Solicita a escolha do usuário
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

            case 3: // Menor caminho em grafos direcionados não ponderados (BFS)
                if (grafoEhDirecionado && !grafoEhPonderado) {
                    console.log("\n=== MENOR CAMINHO DE GRAFOS DIRECIONADOS NAO PONDERADOS (utilizando BFS) ===");
                    const verticeInicial = parseInt(await askQuestion("Digite o vertice inicial: "));
                    grafo.algoritmoBFS(verticeInicial);
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos direcionados nao ponderados!");
                }
                break;

            case 4: // Menor caminho em grafos direcionados ponderados (Dijkstra e Floyd)
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

            case 5: // Menor caminho em grafos não direcionados não ponderados (BFS)
                if (!grafoEhDirecionado && !grafoEhPonderado) {
                    console.log("\n=== MENOR CAMINHO DE GRAFOS NAO DIRECIONADOS NAO PONDERADOS (utilizando BFS)===");
                    const verticeInicial = parseInt(await askQuestion("Digite o vertice inicial: "));
                    grafo.algoritmoBFS(verticeInicial);
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados nao ponderados!");
                }
                break;

            case 6: // Menor caminho em grafos não direcionados ponderados (Dijkstra e Floyd)
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

            case 7: // Árvore Geradora Mínima - Kruskal
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== ARVORE GERADORA MINIMA - KRUSKAL ===");
                    grafo.algoritmoKruskal();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 8: // Árvore Geradora Mínima - Prim
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== ARVORE GERADORA MINIMA - PRIM ===");
                    grafo.algoritmoPrim();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 9: // Árvore Geradora Mínima - Apaga Reverso
                if (!grafoEhDirecionado && grafoEhPonderado) {
                    console.log("\n=== ARVORE GERADORA MINIMA - APAGA REVERSO ===");
                    grafo.algoritmoApagaReverso();
                } else {
                    console.log("\nEsta opcao so pode ser utilizada em grafos nao direcionados ponderados!");
                }
                break;

            case 10: // Ordenação de arestas por peso
                resposta = await askQuestion("Ordenar em ordem (c)rescente ou (d)ecrescente? ");
                grafo.ordenarArestas(resposta.toLowerCase() === 'c');
                break;

            case 11: // Encerra o programa
                console.log("Encerrando programa...");
                programaEncerrado = true;
                break;

            default: // Opção inválida
                console.log("Opção invalida! Tente novamente.");
                break;
        }
    }

    // Fecha a interface de leitura e encerra o programa
    rl.close();
    console.log("Programa encerrado.");
}

/**
 * Executa a função principal se estiver em ambiente Node.js
 * Caso contrário, exibe uma mensagem informativa.
 */
if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
    main().catch(console.error);
} else {
    console.log("Este menu interativo é otimizado para execução em Node.js");
}