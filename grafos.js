class Grafo {
    constructor(direcionado = false) {
        this.vertices = new Map(); // Map para armazenar vértices e suas listas de adjacência
        this.direcionado = direcionado; // Flag para indicar se o grafo é direcionado ou não
    }

    adicionarVertice(vertice) {
        if (!this.vertices.has(vertice)) {
            this.vertices.set(vertice, []); // Inicializa lista de adjacência vazia para o novo vértice
        }
    }

    /**
     * Adiciona uma aresta entre dois vértices
     * 
     * CONCEITO: Em grafos direcionados, a aresta vai apenas da origem para o destino.
     * Em grafos não direcionados, adicionamos duas arestas (origem→destino e destino→origem)
     * para simular uma conexão bidirecional.
     */

    
    adicionarAresta(origem, destino, peso = 1) {
        // Garante que ambos os vértices existam no grafo
        this.adicionarVertice(origem);
        this.adicionarVertice(destino);

        // Adiciona aresta da origem para o destino
        this.vertices.get(origem).push({ destino, peso });

        // Em grafos não direcionados, cada aresta representa uma conexão em ambos sentidos
        // Por isso adicionamos também uma aresta do destino para a origem com o mesmo peso
        if (!this.direcionado) {
            this.vertices.get(destino).push({ destino: origem, peso });
        }
    }

    /**
     * Algoritmo 1: Lista de adjacência - grafos não direcionados
     * 
     * CONCEITO: Em um grafo não direcionado, a lista de adjacência de cada vértice
     * contém todos os vértices aos quais ele está conectado. Como não há direção,
     * se A está conectado a B, então B também está conectado a A.
     * 
     * EXEMPLO:
     * Para o grafo: 1--2--3 (triângulo, não direcionado)
     * Resultado da lista de adjacência:
     * 1: [2, 3]
     * 2: [1, 3]
     * 3: [1, 2]
     * 
     * COMPLEXIDADE: O(V + E) onde V é o número de vértices e E o número de arestas
     */
    listaAdjacenciaNaoDirecionado() {
        console.log("Lista de Adjacência (Grafo Não Direcionado):");
        console.log("============================================");
        console.log("Formato: Vértice: [Lista de vizinhos]");
        console.log("Em grafos não direcionados, se A está na lista de B, então B está na lista de A");

        for (let [vertice, adjacentes] of this.vertices) {
            // Mostra cada vértice seguido da lista de seus vizinhos
            const lista = adjacentes.map(adj => adj.destino).join(", ");
            console.log(`${vertice}: [${lista}]`);
        }
    }

    /**
     * Algoritmo 2: Lista de adjacência - grafos direcionados
     * 
     * CONCEITO: Em um grafo direcionado, a lista de adjacência de cada vértice
     * contém apenas os vértices para os quais existe uma aresta saindo dele.
     * A direção das arestas é importante - se A→B, B só aparece na lista de A,
     * mas A não aparece na lista de B (a menos que exista também B→A).
     * 
     * EXEMPLO:
     * Para o grafo: 1→2, 1→3, 3→2 (triângulo direcionado)
     * Resultado da lista de adjacência:
     * 1: [2, 3]
     * 2: []
     * 3: [2]
     * 
     * COMPLEXIDADE: O(V + E) onde V é o número de vértices e E o número de arestas
     */
    listaAdjacenciaDirecionado() {
        console.log("Lista de Adjacência (Grafo Direcionado):");
        console.log("=========================================");
        console.log("Formato: Vértice: [Lista de destinos]");
        console.log("Em grafos direcionados, a lista contém apenas os vértices para onde há arestas saindo");

        for (let [vertice, adjacentes] of this.vertices) {
            // Mostra cada vértice seguido da lista dos vértices para onde aponta
            const lista = adjacentes.map(adj => adj.destino).join(", ");
            console.log(`${vertice}: [${lista}]`);
        }
    }

    /**
     * Algoritmo 3: Menor caminho - grafos direcionados (BFS - Busca em Largura)
     * 
     * CONCEITO: A Busca em Largura (BFS) explora todos os vértices a uma mesma distância
     * da origem antes de avançar para os mais distantes. Isso garante encontrar o caminho
     * com menor número de arestas em grafos não ponderados.
     * 
     * FUNCIONAMENTO:
     * 1. Começa pelo vértice de origem
     * 2. Explora todos os seus vizinhos diretos
     * 3. Depois, explora os vizinhos dos vizinhos, e assim por diante
     * 4. Usa uma fila para garantir que vértices mais próximos são visitados primeiro
     * 5. Mantém um conjunto de vértices visitados para evitar ciclos
     * 
     * EXEMPLO:
     * Para o grafo: 1→2, 1→3, 3→2
     * Caminho de 1 para 2: [1, 2] (direto)
     * Caminho de 3 para 1: Não existe (não há aresta de 3 para 1)
     * 
     * COMPLEXIDADE: O(V + E) onde V é o número de vértices e E o número de arestas
     * 
     * @param {string} origem - Vértice de origem
     * @param {string} destino - Vértice de destino
     * @returns {Array|null} - Caminho encontrado ou null se não existe
     */
    menorCaminhoDirecionado(origem, destino) {
        const visitados = new Set(); // Conjunto para controlar vértices já visitados
        const fila = [{ vertice: origem, caminho: [origem] }]; // Fila para BFS

        // Enquanto houver vértices a serem explorados na fila
        while (fila.length > 0) {
            // Retira o primeiro elemento da fila (FIFO - First In, First Out)
            const { vertice, caminho } = fila.shift();

            // Se encontrou o destino, retorna o caminho acumulado até agora
            if (vertice === destino) {
                return caminho;
            }

            // Evita ciclos e processamento repetido
            if (visitados.has(vertice)) continue;
            visitados.add(vertice);

            // Para cada vértice adjacente não visitado, adiciona à fila
            for (let adj of this.vertices.get(vertice) || []) {
                if (!visitados.has(adj.destino)) {
                    // Cria uma cópia do caminho atual e adiciona o próximo vértice
                    fila.push({
                        vertice: adj.destino,
                        caminho: [...caminho, adj.destino] // Constrói o caminho progressivamente
                    });
                }
            }
        }
        // Se esvaziou a fila sem encontrar o destino, não existe caminho
        return null;
    }

    /**
     * Algoritmo 4: Menor caminho - grafos direcionados ponderados (Dijkstra)
     * 
     * CONCEITO: O algoritmo de Dijkstra encontra o caminho mais curto em termos de peso total
     * das arestas. Funciona para grafos com pesos positivos.
     * 
     * FUNCIONAMENTO:
     * 1. Inicializa as distâncias: 0 para origem, infinito para os demais vértices
     * 2. Mantém um conjunto de vértices não visitados
     * 3. Em cada iteração, seleciona o vértice não visitado com menor distância
     * 4. Atualiza as distâncias dos vizinhos se encontrar um caminho melhor
     * 5. Processo chamado de "relaxamento" das arestas
     * 
     * LIMITAÇÕES: Não funciona se houver arestas com pesos negativos
     * 
     * EXEMPLO:
     * Para o grafo: 1→2 (peso 3), 1→3 (peso 1), 3→2 (peso 5)
     * Caminho de 1 para 2: [1, 2] com distância 3 (direto é melhor que via 3)
     * Caminho de 1 para 3: [1, 3] com distância 1
     * 
     * COMPLEXIDADE: O(V² + E) onde V é o número de vértices e E o número de arestas
     * Com fila de prioridade: O((V+E)log V)
     * 
     * @param {string} origem - Vértice de origem
     * @param {string} destino - Vértice de destino
     * @returns {Object} - Objeto com distância total e caminho encontrado
     */
    menorCaminhoDirecionadoPonderado(origem, destino) {
        const distancias = new Map(); // Armazena a menor distância conhecida da origem até cada vértice
        const anteriores = new Map(); // Armazena o vértice anterior no caminho mínimo
        const naoVisitados = new Set(); // Conjunto de vértices ainda não processados completamente

        // Passo 1: Inicialização - distância 0 para origem, infinito para os demais
        for (let vertice of this.vertices.keys()) {
            distancias.set(vertice, vertice === origem ? 0 : Infinity);
            naoVisitados.add(vertice);
        }

        // Passo 2: Iteração principal do algoritmo
        while (naoVisitados.size > 0) {
            // 2.1 Encontrar o vértice não visitado com a menor distância atual
            // Em uma implementação mais eficiente, usaríamos uma fila de prioridade
            let atual = null;
            let menorDistancia = Infinity;
            for (let vertice of naoVisitados) {
                if (distancias.get(vertice) < menorDistancia) {
                    menorDistancia = distancias.get(vertice);
                    atual = vertice;
                }
            }

            // Se não encontrou vértice acessível ou já chegou ao destino, interrompe
            if (atual === null || atual === destino) break;
            naoVisitados.delete(atual); // Remove o vértice selecionado do conjunto não visitado

            // 2.2 Relaxamento: atualiza distâncias dos vizinhos se encontrar um caminho melhor
            for (let adj of this.vertices.get(atual) || []) {
                if (naoVisitados.has(adj.destino)) {
                    // Tenta encontrar um caminho melhor através do vértice atual
                    const novaDistancia = distancias.get(atual) + adj.peso;
                    if (novaDistancia < distancias.get(adj.destino)) {
                        // Caminho melhor encontrado - atualiza distância e vértice anterior
                        distancias.set(adj.destino, novaDistancia);
                        anteriores.set(adj.destino, atual);
                    }
                }
            }
        }

        // Passo 3: Reconstrução do caminho a partir do mapa de vértices anteriores
        const caminho = [];
        let atual = destino;
        // Reconstrói o caminho do destino até a origem, depois inverte
        while (atual !== undefined) {
            caminho.unshift(atual); // Adiciona vértice ao início do caminho
            atual = anteriores.get(atual);
        }

        // Verifica se o caminho é válido (deve conter ao menos origem e destino)
        return {
            distancia: distancias.get(destino), // Distância total do caminho
            caminho: caminho.length > 1 ? caminho : null // null se não houver caminho
        };
    }

    /**
     * Algoritmo 5: Menor caminho - grafos não direcionados (BFS)
     * 
     * CONCEITO: Similar ao algoritmo 3, mas aplicado a grafos não direcionados.
     * Como neste caso uma aresta A--B permite tanto ir de A para B quanto de B para A,
     * o grafo é implicitamente bidirecional.
     * 
     * IMPLEMENTAÇÃO: A implementação é idêntica à do algoritmo 3, pois a diferença 
     * entre grafos direcionados e não direcionados já é tratada na estrutura interna
     * e na forma como as arestas são adicionadas (bidirecionais para não direcionados).
     * 
     * EXEMPLO:
     * Para o grafo não direcionado: 1--2--3 (triângulo)
     * Caminho de 1 para 2: [1, 2] (direto)
     * Caminho de 1 para 3: [1, 3] (direto)
     * 
     * COMPLEXIDADE: O(V + E) onde V é o número de vértices e E o número de arestas
     * 
     * @param {string} origem - Vértice de origem
     * @param {string} destino - Vértice de destino
     * @returns {Array|null} - Caminho encontrado ou null se não existe
     */
    menorCaminhoNaoDirecionado(origem, destino) {
        // A implementação é idêntica ao menorCaminhoDirecionado pois a estrutura do grafo
        // já considera a natureza direcionada/não direcionada nas arestas
        const visitados = new Set();
        const fila = [{ vertice: origem, caminho: [origem] }];

        while (fila.length > 0) {
            const { vertice, caminho } = fila.shift();

            if (vertice === destino) {
                return caminho;
            }

            if (visitados.has(vertice)) continue;
            visitados.add(vertice);

            for (let adj of this.vertices.get(vertice) || []) {
                if (!visitados.has(adj.destino)) {
                    fila.push({
                        vertice: adj.destino,
                        caminho: [...caminho, adj.destino]
                    });
                }
            }
        }
        return null;
    }

    /**
     * Algoritmo 6: Menor caminho - grafos não direcionados ponderados (Dijkstra)
     * 
     * CONCEITO: Similar ao algoritmo 4, mas para grafos não direcionados.
     * O algoritmo de Dijkstra funciona igualmente bem para grafos direcionados
     * e não direcionados, pois depende apenas das arestas e seus pesos.
     * 
     * IMPLEMENTAÇÃO: Reutiliza o algoritmo de Dijkstra, já que a diferença entre
     * grafos direcionados e não direcionados está na estrutura interna do grafo
     * (arestas bidirecionais para grafos não direcionados).
     * 
     * EXEMPLO:
     * Para o grafo não direcionado: 1--2--3 com pesos (1--2: 3, 1--3: 1, 2--3: 5)
     * Caminho de 1 para 2: pode ser [1, 2] com distância 3 ou [1, 3, 2] com distância 1+5=6,
     * então o algoritmo escolhe [1, 2] por ter menor peso total
     * 
     * COMPLEXIDADE: Igual ao Dijkstra - O(V² + E) ou O((V+E)log V) com fila de prioridade
     * 
     * @param {string} origem - Vértice de origem
     * @param {string} destino - Vértice de destino
     * @returns {Object} - Objeto com distância total e caminho encontrado
     */
    menorCaminhoNaoDirecionadoPonderado(origem, destino) {
        // Como o grafo é não direcionado, podemos usar o mesmo algoritmo Dijkstra
        // A diferença já está na estrutura do grafo, com arestas em ambas direções
        return this.menorCaminhoDirecionadoPonderado(origem, destino);
    }

    /**
     * Algoritmo 7: Árvore geradora mínima - Kruskal
     * 
     * CONCEITO: Uma árvore geradora mínima (AGM) é um subconjunto de arestas que:
     * 1. Conecta todos os vértices do grafo
     * 2. Não possui ciclos (é uma árvore)
     * 3. Tem o menor peso total possível
     * 
     * FUNCIONAMENTO DO ALGORITMO DE KRUSKAL:
     * 1. Ordena todas as arestas em ordem crescente de peso
     * 2. Inicializa cada vértice como um conjunto separado (floresta de árvores isoladas)
     * 3. Para cada aresta, em ordem crescente de peso:
     *    a. Se adicionar a aresta não forma ciclo (vértices em conjuntos diferentes)
     *    b. Adiciona a aresta à árvore e une os conjuntos dos vértices
     * 4. Continua até que todos os vértices estejam conectados (n-1 arestas para n vértices)
     * 
     * APLICAÇÕES: Redes elétricas, de telecomunicações, hidráulicas, etc.
     * 
     * EXEMPLO:
     * Para o grafo não direcionado: 1--2--3 com pesos (1--2: 3, 1--3: 1, 2--3: 5)
     * Ordenação das arestas: (1--3: 1), (1--2: 3), (2--3: 5)
     * AGM resultante: (1--3: 1), (1--2: 3) com peso total 4
     * 
     * COMPLEXIDADE: O(E log E) onde E é o número de arestas, dominado pela ordenação
     * 
     * @returns {Array} - Lista de arestas que formam a árvore geradora mínima
     */
    kruskal() {
        // Passo 1: Ordenar todas as arestas por peso (menor para maior)
        const arestasPorPeso = this.ordenarArestasPorPeso(true);
        const conjuntos = new DisjointSet(); // Estrutura Union-Find para detecção de ciclos
        const arvoreGeradora = []; // Resultado: arestas da árvore geradora mínima

        // Passo 2: Inicializa cada vértice como um conjunto separado
        for (let vertice of this.vertices.keys()) {
            conjuntos.makeSet(vertice);
        }

        // Passo 3: Para cada aresta, em ordem crescente de peso
        for (let aresta of arestasPorPeso) {
            // Verifica se a adição da aresta forma ciclo
            // (se os vértices já estão no mesmo conjunto)
            if (conjuntos.find(aresta.origem) !== conjuntos.find(aresta.destino)) {
                // Se não forma ciclo, adiciona à árvore geradora
                arvoreGeradora.push(aresta);
                // Une os conjuntos dos dois vértices
                conjuntos.union(aresta.origem, aresta.destino);
            }
        }

        return arvoreGeradora;
    }

    /**
     * Algoritmo 8: Árvore geradora mínima - Prim
     * 
     * CONCEITO: Assim como Kruskal, o algoritmo de Prim também encontra uma AGM,
     * mas com uma estratégia diferente.
     * 
     * FUNCIONAMENTO DO ALGORITMO DE PRIM:
     * 1. Começa com um único vértice (qualquer um)
     * 2. A cada passo, adiciona a aresta de menor peso que conecta:
     *    a. Um vértice já na árvore
     *    b. Com um vértice ainda não incluído
     * 3. Continua até que todos os vértices estejam na árvore
     * 
     * DIFERENÇA DE KRUSKAL:
     * - Kruskal: seleciona arestas globalmente, pode formar componentes desconexos temporariamente
     * - Prim: cresce a partir de um único vértice, mantendo sempre uma única árvore conexa
     * 
     * EXEMPLO:
     * Para o grafo não direcionado: 1--2--3 com pesos (1--2: 3, 1--3: 1, 2--3: 5)
     * Começando pelo vértice 1:
     * 1. Adiciona aresta 1--3 (peso 1)
     * 2. Adiciona aresta 1--2 (peso 3)
     * AGM resultante: (1--3: 1), (1--2: 3) com peso total 4 (igual a Kruskal para este exemplo)
     * 
     * COMPLEXIDADE: O(V²) com matriz de adjacência, O(E log V) com fila de prioridade
     * 
     * @param {string} inicial - Vértice inicial para começar o algoritmo
     * @returns {Array} - Lista de arestas que formam a árvore geradora mínima
     */
    prim(inicial) {
        // Se não foi especificado vértice inicial, usa o primeiro do grafo
        if (!inicial) {
            inicial = this.vertices.keys().next().value;
        }

        const visitados = new Set([inicial]); // Conjunto de vértices já incluídos na AGM
        const arvoreGeradora = []; // Resultado: arestas da árvore geradora mínima

        // Continua até que todos os vértices estejam na árvore
        while (visitados.size < this.vertices.size) {
            let melhorAresta = null;
            let melhorPeso = Infinity;

            // Para cada vértice já na árvore, procura a aresta de menor peso
            // que leva a um vértice ainda não incluído
            for (let vertice of visitados) {
                // Examina todas as arestas adjacentes ao vértice
                for (let adj of this.vertices.get(vertice)) {
                    // Verifica se o destino não foi visitado e se o peso é menor
                    if (!visitados.has(adj.destino) && adj.peso < melhorPeso) {
                        melhorAresta = {
                            origem: vertice,
                            destino: adj.destino,
                            peso: adj.peso
                        };
                        melhorPeso = adj.peso;
                    }
                }
            }

            // Se encontrou uma aresta válida, adiciona à árvore
            if (melhorAresta) {
                arvoreGeradora.push(melhorAresta);
                visitados.add(melhorAresta.destino); // Marca o novo vértice como visitado
            } else {
                // Se não encontrou aresta válida, o grafo não é conexo
                // (não é possível formar uma árvore geradora que inclua todos os vértices)
                break;
            }
        }

        return arvoreGeradora;
    }

    /**
     * Algoritmo 9: Árvore geradora mínima - ApagaReservo
     * 
     * CONCEITO: Este algoritmo é uma variação inversa do algoritmo de Kruskal.
     * Enquanto Kruskal adiciona arestas da mais leve para a mais pesada,
     * o ApagaReservo tenta remover arestas da mais pesada para a mais leve,
     * desde que a remoção não desconecte o grafo.
     * 
     * FUNCIONAMENTO:
     * 1. Começa com o grafo completo
     * 2. Ordena as arestas em ordem decrescente de peso
     * 3. Para cada aresta, tenta remover:
     *    a. Verifica se a remoção desconecta o grafo
     *    b. Se não desconecta, a aresta é removida; caso contrário, é mantida
     * 
     * NOTA INTERESSANTE: ApagaReservo e Kruskal produzem o mesmo resultado final,
     * porém ApagaReservo pode ser mais intuitivo em certos contextos.
     * 
     * EXEMPLO:
     * Para o grafo não direcionado: 1--2--3 com pesos (1--2: 3, 1--3: 1, 2--3: 5)
     * Ordenação decrescente: (2--3: 5), (1--2: 3), (1--3: 1)
     * 1. Remove 2--3 (conectividade mantida via 1)
     * 2. Tenta remover 1--2, mas isso desconectaria 2, então mantém
     * 3. Tenta remover 1--3, mas isso desconectaria 3, então mantém
     * AGM resultante: (1--2: 3), (1--3: 1) com peso total 4
     * 
     * COMPLEXIDADE: O(E²) onde E é o número de arestas
     * 
     * @returns {Array} - Lista de arestas que formam a árvore geradora mínima
     */
    apagaReservo() {
        // Passo 1: Ordena arestas por peso (maior para menor)
        const arestas = this.ordenarArestasPorPeso(false);
        // Faz uma cópia das arestas - estas serão as que sobrevivem após tentarmos remover
        const resultado = [...arestas];
        const conjuntos = new DisjointSet();

        // Passo 2: Inicializa conjuntos disjuntos para teste de conectividade
        for (let vertice of this.vertices.keys()) {
            conjuntos.makeSet(vertice);
        }

        // Passo 3: Para cada aresta, das mais pesadas para as mais leves
        for (let aresta of arestas) {
            // Remove temporariamente a aresta
            const index = resultado.findIndex(a =>
                a.origem === aresta.origem &&
                a.destino === aresta.destino &&
                a.peso === aresta.peso);

            if (index !== -1) {
                resultado.splice(index, 1);
            }

            // Passo 4: Verifica se o grafo continua conexo após remover a aresta
            // Isso é feito criando um novo conjunto de conjuntos disjuntos
            // e unindo os vértices conectados pelas arestas restantes
            const testConjuntos = new DisjointSet();
            for (let vertice of this.vertices.keys()) {
                testConjuntos.makeSet(vertice);
            }

            // Une vértices conectados pelas arestas que sobraram
            for (let a of resultado) {
                testConjuntos.union(a.origem, a.destino);
            }

            // Verifica se todos os vértices estão no mesmo conjunto (grafo conexo)
            // Pega o representante do primeiro vértice como referência
            const primeiroRep = testConjuntos.find(this.vertices.keys().next().value);
            let conexo = true;

            // Se algum vértice estiver em conjunto diferente, o grafo está desconexo
            for (let vertice of this.vertices.keys()) {
                if (testConjuntos.find(vertice) !== primeiroRep) {
                    conexo = false;
                    break;
                }
            }

            // Se a remoção desconecta o grafo, adiciona a aresta de volta
            if (!conexo) {
                resultado.push(aresta);
            }
        }

        return resultado;
    }

    /**
     * Algoritmo 10: Ordenação de arestas por peso
     * 
     * CONCEITO: Este algoritmo coleta todas as arestas do grafo e as ordena
     * com base em seus pesos, em ordem crescente ou decrescente.
     * É útil como subrotina para outros algoritmos como Kruskal e ApagaReservo.
     * 
     * FUNCIONAMENTO:
     * 1. Percorre todos os vértices e suas listas de adjacência
     * 2. Coleta as arestas em um array, evitando duplicatas em grafos não direcionados
     * 3. Ordena o array pelo peso das arestas
     * 
     * EXEMPLO:
     * Para o grafo não direcionado: 1--2--3 com pesos (1--2: 3, 1--3: 1, 2--3: 5)
     * Ordenação crescente: (1--3: 1), (1--2: 3), (2--3: 5)
     * Ordenação decrescente: (2--3: 5), (1--2: 3), (1--3: 1)
     * 
     * COMPLEXIDADE: O(E log E) onde E é o número de arestas, dominado pela ordenação
     * 
     * @param {boolean} crescente - true para ordenar crescente, false para decrescente
     * @returns {Array} - Lista de arestas ordenadas por peso
     */
    ordenarArestasPorPeso(crescente = true) {
        const arestas = [];

        // Passo 1: Coleta todas as arestas do grafo
        for (let [origem, adjacentes] of this.vertices) {
            for (let adj of adjacentes) {
                // Para grafos não direcionados, evita incluir arestas duplicadas
                // Convenção: só inclui a aresta se origem < destino
                // Exemplo: inclui 1--2 mas não 2--1 (são a mesma aresta)
                if (!this.direcionado && origem > adj.destino) continue;

                arestas.push({
                    origem,
                    destino: adj.destino,
                    peso: adj.peso
                });
            }
        }

        // Passo 2: Ordena as arestas por peso
        // Se crescente=true: a.peso - b.peso (menor para maior)
        // Se crescente=false: b.peso - a.peso (maior para menor)
        arestas.sort((a, b) => crescente ? a.peso - b.peso : b.peso - a.peso);
        return arestas;
    }
}

/**
 * Classe DisjointSet (União-Encontro ou Union-Find)
 * 
 * CONCEITO: Esta estrutura de dados mantém uma coleção de conjuntos disjuntos
 * e permite operações eficientes de:
 * 1. Verificar se dois elementos estão no mesmo conjunto
 * 2. Unir dois conjuntos
 * 
 * É utilizada principalmente para detectar ciclos em grafos (Kruskal)
 * e testar conectividade (ApagaReservo).
 * 
 * OTIMIZAÇÕES IMPLEMENTADAS:
 * - Compressão de caminhos: acelera operações futuras de find()
 * - União por rank: mantém a árvore balanceada para operações mais eficientes
 * 
 * COMPLEXIDADE AMORTIZADA:
 * - find(): O(α(n)) onde α é a função de Ackermann inversa (praticamente constante)
 * - union(): O(α(n))
 */
class DisjointSet {
    constructor() {
        this.parent = new Map(); // Mapa que armazena o pai de cada elemento
        this.rank = new Map();   // Mapa que armazena a altura da árvore (para otimização)
    }

    /**
     * Cria um novo conjunto com um único elemento
     * 
     * Inicialmente, cada elemento é seu próprio representante (ou pai)
     * e tem rank (altura) zero.
     * 
     * COMPLEXIDADE: O(1)
     * 
     * @param {string} x - Elemento a ser adicionado como novo conjunto
     */
    makeSet(x) {
        this.parent.set(x, x); // Elemento é seu próprio pai inicialmente
        this.rank.set(x, 0);   // Altura inicial da árvore é 0
    }

    /**
     * Encontra o representante (raiz) do conjunto que contém x
     * 
     * OTIMIZAÇÃO: Usa compressão de caminhos, que consiste em atualizar
     * o pai de cada elemento visitado para apontar diretamente para a raiz.
     * Isso aplana a árvore e torna operações futuras mais eficientes.
     * 
     * COMPLEXIDADE: O(α(n)) onde α é a função de Ackermann inversa
     * Na prática, quase O(1) para qualquer entrada realista
     * 
     * @param {string} x - Elemento para encontrar o representante
     * @returns {string} - Representante do conjunto
     */
    find(x) {
        if (this.parent.get(x) !== x) {
            // Compressão de caminho: liga x diretamente à raiz
            // Em vez de apenas retornar find(parent[x]), atualizamos parent[x]
            this.parent.set(x, this.find(this.parent.get(x)));
        }
        return this.parent.get(x);
    }

    /**
     * Une dois conjuntos (que contêm x e y)
     * 
     * OTIMIZAÇÃO: Usa união por rank, que liga a árvore de menor altura
     * à raiz da árvore de maior altura. Isso mantém as árvores balanceadas
     * e minimiza a altura resultante.
     * 
     * COMPLEXIDADE: O(α(n)) dominado pelo custo de find()
     * 
     * @param {string} x - Elemento do primeiro conjunto
     * @param {string} y - Elemento do segundo conjunto
     */
    union(x, y) {
        // Primeiro encontra as raízes dos conjuntos de x e y
        const rootX = this.find(x);
        const rootY = this.find(y);

        // Se já estão no mesmo conjunto, não faz nada
        if (rootX === rootY) {
            return;
        }

        // União por rank: liga a árvore de menor altura à de maior altura
        if (this.rank.get(rootX) < this.rank.get(rootY)) {
            // Se a altura de X é menor, X se torna filho de Y
            this.parent.set(rootX, rootY);
        } else {
            // Se a altura de Y é menor ou igual, Y se torna filho de X
            this.parent.set(rootY, rootX);

            // Se as duas árvores tinham a mesma altura, a altura resultante aumenta em 1
            if (this.rank.get(rootX) === this.rank.get(rootY)) {
                this.rank.set(rootX, this.rank.get(rootX) + 1);
            }
        }
    }
}


function iniciarMenu() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Inicializa com um grafo não direcionado de exemplo
    let grafoAtual = criarGrafoExemplo(false);
    let direcionado = false;

    function exibirMenu() {
        console.log("\n=== ALGORITMOS DE GRAFOS ===");
        console.log(`Grafo atual: ${direcionado ? 'Direcionado' : 'Não direcionado'}`);
        console.log("1. Lista de adjacência (não direcionado)");
        console.log("2. Lista de adjacência (direcionado)");
        console.log("3. Menor caminho (direcionado)");
        console.log("4. Menor caminho ponderado (direcionado)");
        console.log("5. Menor caminho (não direcionado)");
        console.log("6. Menor caminho ponderado (não direcionado)");
        console.log("7. Árvore geradora mínima (Kruskal)");
        console.log("8. Árvore geradora mínima (Prim)");
        console.log("9. Árvore geradora mínima (ApagaReservo)");
        console.log("10. Ordenação de arestas por peso");
        console.log("11. Alternar tipo de grafo");
        console.log("0. Sair");

        rl.question("\nEscolha uma opção: ", (opcao) => {
            tratarOpcao(opcao);
        });
    }


    function tratarOpcao(opcao) {
        switch (opcao) {
            case '0':
                console.log("Encerrando programa...");
                rl.close();
                break;
            case '1':
                if (direcionado) {
                    console.log("\nEsta opção só funciona para grafos não direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo não direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 1: LISTA DE ADJACÊNCIA (NÃO DIRECIONADO) ===");
                    console.log("Objetivo: Mostrar os vizinhos de cada vértice no grafo não direcionado");
                    console.log("Resultado:");
                    grafoAtual.listaAdjacenciaNaoDirecionado();
                    voltarAoMenu();
                }
                break;
            case '2':
                if (!direcionado) {
                    console.log("\nEsta opção só funciona para grafos direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 2: LISTA DE ADJACÊNCIA (DIRECIONADO) ===");
                    console.log("Objetivo: Mostrar os destinos de cada vértice no grafo direcionado");
                    console.log("Resultado:");
                    grafoAtual.listaAdjacenciaDirecionado();
                    voltarAoMenu();
                }
                break;
            case '3':
                if (!direcionado) {
                    console.log("\nEsta opção só funciona para grafos direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 3: MENOR CAMINHO (DIRECIONADO) ===");
                    console.log("Objetivo: Encontrar o caminho com menor número de arestas");
                    console.log("Método: Busca em Largura (BFS)");

                    obterOrigemDestino((origem, destino) => {
                        console.log(`\nBuscando menor caminho de ${origem} para ${destino}...`);
                        const caminho = grafoAtual.menorCaminhoDirecionado(origem, destino);
                        if (caminho) {
                            console.log(`Menor caminho encontrado: ${caminho.join(' -> ')}`);
                            console.log(`Número de arestas: ${caminho.length - 1}`);
                        } else {
                            console.log("Não existe caminho entre os vértices especificados.");
                        }
                        voltarAoMenu();
                    });
                }
                break;
            case '4':
                if (!direcionado) {
                    console.log("\nEsta opção só funciona para grafos direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 4: MENOR CAMINHO PONDERADO (DIRECIONADO) ===");
                    console.log("Objetivo: Encontrar o caminho com menor soma de pesos das arestas");
                    console.log("Método: Algoritmo de Dijkstra");

                    obterOrigemDestino((origem, destino) => {
                        console.log(`\nBuscando menor caminho ponderado de ${origem} para ${destino}...`);
                        const resultado = grafoAtual.menorCaminhoDirecionadoPonderado(origem, destino);
                        if (resultado.caminho) {
                            console.log(`Menor caminho: ${resultado.caminho.join(' -> ')}`);
                            console.log(`Distância total (soma dos pesos): ${resultado.distancia}`);
                        } else {
                            console.log("Não existe caminho entre os vértices especificados.");
                        }
                        voltarAoMenu();
                    });
                }
                break;
            case '5':
                if (direcionado) {
                    console.log("\nEsta opção só funciona para grafos não direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo não direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 5: MENOR CAMINHO (NÃO DIRECIONADO) ===");
                    console.log("Objetivo: Encontrar o caminho com menor número de arestas");
                    console.log("Método: Busca em Largura (BFS)");

                    obterOrigemDestino((origem, destino) => {
                        console.log(`\nBuscando menor caminho de ${origem} para ${destino}...`);
                        const caminho = grafoAtual.menorCaminhoNaoDirecionado(origem, destino);
                        if (caminho) {
                            console.log(`Menor caminho encontrado: ${caminho.join(' -> ')}`);
                            console.log(`Número de arestas: ${caminho.length - 1}`);
                        } else {
                            console.log("Não existe caminho entre os vértices especificados.");
                        }
                        voltarAoMenu();
                    });
                }
                break;
            case '6':
                if (direcionado) {
                    console.log("\nEsta opção só funciona para grafos não direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo não direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 6: MENOR CAMINHO PONDERADO (NÃO DIRECIONADO) ===");
                    console.log("Objetivo: Encontrar o caminho com menor soma de pesos das arestas");
                    console.log("Método: Algoritmo de Dijkstra");

                    obterOrigemDestino((origem, destino) => {
                        console.log(`\nBuscando menor caminho ponderado de ${origem} para ${destino}...`);
                        const resultado = grafoAtual.menorCaminhoNaoDirecionadoPonderado(origem, destino);
                        if (resultado.caminho) {
                            console.log(`Menor caminho: ${resultado.caminho.join(' -> ')}`);
                            console.log(`Distância total (soma dos pesos): ${resultado.distancia}`);
                        } else {
                            console.log("Não existe caminho entre os vértices especificados.");
                        }
                        voltarAoMenu();
                    });
                }
                break;
            case '7':
                if (direcionado) {
                    console.log("\nKruskal só funciona para grafos não direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo não direcionado.");
                } else {
                    console.log("\n=== ALGORITMO 7: ÁRVORE GERADORA MÍNIMA (KRUSKAL) ===");
                    console.log("Objetivo: Encontrar subconjunto de arestas que conecta todos os vértices com peso mínimo");
                    console.log("Método: Adiciona arestas em ordem crescente de peso, evitando ciclos");

                    const arvore = grafoAtual.kruskal();
                    console.log("\nÁrvore Geradora Mínima (Kruskal):");
                    let pesoTotal = 0;
                    for (let aresta of arvore) {
                        console.log(`${aresta.origem} -- ${aresta.destino} (peso: ${aresta.peso})`);
                        pesoTotal += aresta.peso;
                    }
                    console.log(`\nPeso total da árvore: ${pesoTotal}`);
                    console.log(`Número de arestas na árvore: ${arvore.length}`);
                }
                voltarAoMenu();
                break;
            case '8':
                if (direcionado) {
                    console.log("\nPrim só funciona para grafos não direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo não direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 8: ÁRVORE GERADORA MÍNIMA (PRIM) ===");
                    console.log("Objetivo: Encontrar subconjunto de arestas que conecta todos os vértices com peso mínimo");
                    console.log("Método: Cresce a árvore a partir de um vértice, adicionando sempre a aresta de menor peso");

                    rl.question("\nVértice inicial: ", (inicial) => {
                        console.log(`\nConstruindo AGM a partir do vértice ${inicial}...`);
                        const arvore = grafoAtual.prim(inicial);
                        console.log("\nÁrvore Geradora Mínima (Prim):");
                        let pesoTotal = 0;
                        for (let aresta of arvore) {
                            console.log(`${aresta.origem} -- ${aresta.destino} (peso: ${aresta.peso})`);
                            pesoTotal += aresta.peso;
                        }
                        console.log(`\nPeso total da árvore: ${pesoTotal}`);
                        console.log(`Número de arestas na árvore: ${arvore.length}`);
                        voltarAoMenu();
                    });
                }
                break;
            case '9':
                if (direcionado) {
                    console.log("\nApagaReservo só funciona para grafos não direcionados.");
                    console.log("Use a opção 11 para alternar para um grafo não direcionado.");
                    voltarAoMenu();
                } else {
                    console.log("\n=== ALGORITMO 9: ÁRVORE GERADORA MÍNIMA (APAGARESERVO) ===");
                    console.log("Objetivo: Encontrar subconjunto de arestas que conecta todos os vértices com peso mínimo");
                    console.log("Método: Remove arestas em ordem decrescente de peso, desde que não desconecte o grafo");

                    const arvore = grafoAtual.apagaReservo();
                    console.log("\nÁrvore Geradora Mínima (ApagaReservo):");
                    let pesoTotal = 0;
                    for (let aresta of arvore) {
                        console.log(`${aresta.origem} -- ${aresta.destino} (peso: ${aresta.peso})`);
                        pesoTotal += aresta.peso;
                    }
                    console.log(`\nPeso total da árvore: ${pesoTotal}`);
                    console.log(`Número de arestas na árvore: ${arvore.length}`);
                }
                voltarAoMenu();
                break;
            case '10':
                console.log("\n=== ALGORITMO 10: ORDENAÇÃO DE ARESTAS POR PESO ===");
                console.log("Objetivo: Listar todas as arestas do grafo ordenadas por peso");

                rl.question("\nOrdenar por peso (1-crescente, 2-decrescente): ", (opcaoOrdem) => {
                    const crescente = opcaoOrdem === '1';
                    const arestas = grafoAtual.ordenarArestasPorPeso(crescente);
                    console.log(`\nArestas ordenadas por peso (${crescente ? 'crescente' : 'decrescente'}):`);
                    console.log("Formato: origem -> destino (peso)");

                    for (let aresta of arestas) {
                        console.log(`${aresta.origem} -> ${aresta.destino} (peso: ${aresta.peso})`);
                    }

                    console.log(`\nTotal de arestas: ${arestas.length}`);
                    voltarAoMenu();
                });
                break;
            case '11':
                direcionado = !direcionado;
                grafoAtual = criarGrafoExemplo(direcionado);
                console.log(`\nTipo de grafo alterado para: ${direcionado ? 'Direcionado' : 'Não direcionado'}`);
                voltarAoMenu();
                break;
            default:
                console.log("\nOpção inválida! Por favor, escolha uma opção entre 0 e 11.");
                voltarAoMenu();
                break;
        }
    }

    /**
     * Solicita vértices de origem e destino ao usuário
     * 
     * @param {Function} callback - Função a ser chamada com os vértices informados
     */
    function obterOrigemDestino(callback) {
        rl.question("\nVértice de origem: ", (origem) => {
            rl.question("Vértice de destino: ", (destino) => {
                callback(origem, destino);
            });
        });
    }

    function voltarAoMenu() {
        rl.question("\nPressione Enter para voltar ao menu principal...", () => {
            exibirMenu();
        });
    }

    function criarGrafoExemplo(direcionado) {
        const grafo = new Grafo(direcionado);

        if (direcionado) {
            // Grafo direcionado triangular com pesos
            grafo.adicionarAresta('1', '2', 3); // 1→2 com peso 3
            grafo.adicionarAresta('1', '3', 1); // 1→3 com peso 1
            grafo.adicionarAresta('3', '2', 5); // 3→2 com peso 5
        } else {
            // Grafo não direcionado triangular com pesos
            grafo.adicionarAresta('1', '2', 3); // 1—2 com peso 3
            grafo.adicionarAresta('1', '3', 1); // 1—3 com peso 1
            grafo.adicionarAresta('2', '3', 5); // 2—3 com peso 5
        }

        return grafo;
    }

    console.log("=============================================");
    console.log("    PROGRAMA DE ALGORITMOS DE GRAFOS");
    console.log("=============================================");
    console.log("\nBem-vindo ao programa de algoritmos de grafos!");
    console.log("\nEste programa implementa 10 algoritmos fundamentais para manipulação de grafos,");
    console.log("incluindo busca de caminhos mínimos e árvores geradoras mínimas.");
    console.log("\nGrafo pré-definido: Triângulo com vértices 1, 2 e 3");
    console.log("Arestas e pesos:");
    console.log("- 1 para 2: peso 3");
    console.log("- 1 para 3: peso 1");
    console.log("- 3 para 2: peso 5");
    exibirMenu();
}

iniciarMenu();