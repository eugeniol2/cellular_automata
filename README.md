# Simulação de Epidemia com Autômatos Celulares e Algoritmos Genéticos Artigo: 

Este projeto apresenta um modelo híbrido para simular a dinâmica de doenças infecciosas, integrando a Modelagem Baseada em Agentes (ABM) com um ambiente de Autômatos Celulares (AC). A simulação explora como barreiras espaciais e características individuais dos agentes influenciam a disseminação de uma epidemia, utilizando a dimensão fractal como métrica principal para a análise da complexidade espacial.

Este trabalho foi desenvolvido como projeto final para as disciplinas de Epidemiologia e Autômatos Celulares, com base nos referenciais teóricos de "Modeling Infectious Diseases in Humans and Animals" por Keeling & Rohani e "Cellular Automata: A Discrete View of the World" por Joel L. Schiff.

---

Artigo: [A Hybrid Agent-Based and Cellular Automata Model for Simulating Epidemic Dynamics and Spatial Complexity.pdf](https://github.com/user-attachments/files/21669100/A.Hybrid.Agent-Based.and.Cellular.Automata.Model.for.Simulating.Epidemic.Dynamics.and.Spatial.Complexity.pdf)

Link projeto: https://cellular-automata-smoky.vercel.app/
---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Conceitos Fundamentais](#-conceitos-fundamentais)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar a Simulação](#-como-executar-a-simulação)
- [Parâmetros da Simulação](#-parâmetros-da-simulação)
- [Análise e Métricas](#-análise-e-métricas)
- [Exemplos de Resultados](#-exemplos-de-resultados)
- [Trabalhos Futuros](#-trabalhos-futuros)
- [Autor](#-autor)

---

## 📖 Visão Geral

Modelos epidemiológicos tradicionais, como o modelo SIR (Suscetível, Infectado, Recuperado), frequentemente assumem uma mistura homogênea dentro de uma população. Este projeto desafia essa premissa ao introduzir um ambiente dinâmico e espacialmente estruturado.

- **Agentes:** Representam indivíduos em uma população. Cada agente possui seu próprio estado (Suscetível, Infectado ou Recuperado) e um "genoma" único que determina sua suscetibilidade à infecção.
- **Ambiente:** É uma grade 2D que evolui de acordo com regras de Autômatos Celulares. Células "vivas" no AC atuam como barreiras dinâmicas, bloqueando o movimento dos agentes e alterando o curso da epidemia.
- **Objetivo:** Observar como a interação entre o comportamento dos agentes e o ambiente em evolução molda a disseminação da epidemia e quantificar esse padrão espacial usando a análise da dimensão fractal.

---

## 🧠 Conceitos Fundamentais

Este modelo é construído na interseção de três campos principais:

1.  **Modelagem Epidemiológica (SIR):** Os agentes transitam entre os estados Suscetível, Infectado e Recuperado, formando a base da dinâmica da doença.
2.  **Autômatos Celulares (AC):** O ambiente não é estático. Ele evolui com base em regras locais simples (por exemplo, variantes do Jogo da Vida de Conway, como *HighLife* ou *Seeds*), criando uma paisagem complexa e em constante mudança de obstáculos. Isso aplica diretamente os conceitos do trabalho de Schiff.
3.  **Análise de Complexidade Espacial:** Para medir *como* a epidemia se espalha, calculamos a **Dimensão Fractal de Box-Counting** da população infectada. Essa métrica, oriunda da teoria do caos e dos estudos de AC, quantifica a complexidade e a natureza de preenchimento de espaço do padrão de infecção. Uma dimensão alta (~2) indica uma disseminação ampla e difusa, enquanto uma dimensão baixa (~1) sugere um padrão mais linear ou contido.

---

## ✨ Funcionalidades

- **Simulação Interativa:** Execute a simulação diretamente no navegador com visualização em tempo real.
- **Parâmetros Personalizáveis:** Ajuste uma vasta gama de parâmetros, incluindo:
  - Velocidade da simulação (clock).
  - Regras de Autômatos Celulares para o ambiente.
  - Tamanho da população e metas de reprodução.
  - Características da doença (raio de contágio, duração da infecção, letalidade).
  - Genética dos agentes (chance de nascer imune).
- **Visualização de Dados em Tempo Real:**
  - Uma grade dinâmica mostra os agentes se movendo e mudando de estado.
  - Contadores ao vivo para agentes Suscetíveis, Infectados, Recuperados e falecidos.
  - Um gráfico que plota a evolução da **Dimensão Fractal** da epidemia ao longo do tempo.

---

## 💻 Tecnologias Utilizadas

- **Framework:** Next.js / React
- **Linguagem:** TypeScript
- **Gerenciamento de Estado:** Jotai
- **Componentes de UI:** Material-UI (MUI)
- **Gráficos:** Recharts

---

## 🚀 Como Executar a Simulação

Para executar este projeto localmente, siga estes passos:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/eugeniol2/epidemic-simulation.git
    cd epidemic-simulation
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

4.  Abra [http://localhost:3000](http://localhost:3000 ) no seu navegador para ver a simulação.

---

## ⚙️ Parâmetros da Simulação

A simulação pode ser configurada através do painel de controle. Os principais parâmetros incluem:

- **Clock (ms):** Tempo em milissegundos entre cada passo da simulação.
- **Regra do AC:** A regra que governa a evolução das barreiras ambientais (ex: HighLife, Seeds).
- **População Inicial:** O número de agentes no início.
- **População Alvo:** O nível populacional que o mecanismo de reprodução da simulação tentará alcançar.
- **Raio de Contágio:** O raio (em células) dentro do qual um agente infectado pode transmitir a doença.
- **Duração da Infecção:** O número de passos de simulação que um agente permanece no estado "Infectado".
- **Taxa de Morte Natural e Viral (%):** A probabilidade de um agente morrer de causas naturais ou do vírus a cada passo.
- **Chance de Nascer Imune (%):** A probabilidade de um novo agente ser criado com imunidade.

---

## 📊 Análise e Métricas

O principal resultado para análise é o **Gráfico de Dimensão Fractal**. Este gráfico exibe a dimensão de box-counting calculada para o conjunto de agentes infectados em intervalos regulares. Ele fornece uma medida quantitativa da complexidade espacial da epidemia, permitindo uma comparação objetiva entre diferentes execuções da simulação.

- **Dimensão Crescente:** Indica que a epidemia está se espalhando e ocupando mais espaço de maneira complexa.
- **Dimensão Decrescente:** Sugere que a epidemia está recuando e se fragmentando em clusters menores e menos complexos.

---

## 📈 Exemplos de Resultados

As simulações mostram uma forte correlação entre a regra do AC e o resultado da epidemia.

- **Regra HighLife:** Cria barreiras densas e estáveis, levando a uma epidemia mais contida, com um número final menor de agentes infectados e uma dimensão fractal em declínio acentuado após seu pico.
- **Regra Seeds:** Cria um ambiente esparso e caótico, permitindo uma epidemia mais generalizada e severa, refletida em uma dimensão fractal mais alta e sustentada.

| Resultado da Simulação com Seeds | Resultado da Simulação com HighLife |
| :---: | :---: |
| ![Simulação com Seeds](https://github.com/user-attachments/assets/d7c4c33e-4615-4ea1-8a40-e7d1cf8fff7b ) | ![Simulação com HighLife](https://github.com/user-attachments/assets/1d3174aa-6a32-455f-963d-57052d4d28cb ) |

**Figura 1 | Evolução da Dimensão Fractal e Resultados da Simulação sob Diferentes Regras de AC.** Os painéis mostram os resultados finais e a evolução da dimensão fractal para as regras (A) "Seeds" e (B) "HighLife". A regra do ambiente influencia diretamente a complexidade espacial e o resultado da epidemia.

---



## 🔮 Trabalhos Futuros

- Implementar padrões de movimento de agentes mais complexos (ex: movimento orientado a objetivos em vez de aleatório).
- Introduzir estruturas de redes sociais (ex: redes de mundo pequeno) para governar as interações dos agentes em vez da simples proximidade.
- Permitir a evolução do genoma do agente usando algoritmos genéticos para observar se a resistência pode emergir naturalmente na população.

---


## 👤 Autor

- **Eugênio Dorneles das Chagas Araújo**
- **GitHub:** [https://github.com/eugeniol2](https://github.com/eugeniol2 )
- **LinkedIn:** [https://www.linkedin.com/in/eugenio-dorneles-araujo/](https://www.linkedin.com/in/eugenio-dorneles-araujo/ )
