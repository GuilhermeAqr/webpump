# WebPump Vet — Suite Clínica de Infusão e Diluição Veterinária

Projeto **Angular 17 + TypeScript + Tailwind CSS** que unifica as 4 páginas
estáticas originais (protótipos HTML/JS isolados) em uma única SPA (Single
Page Application) navegável, com proteção de rotas e todas as regras de
negócio/cálculos preservados.

## Páginas / Rotas

| Rota                        | Página original                                  | Descrição                                                        |
|------------------------------|--------------------------------------------------|-------------------------------------------------------------------|
| `/acesso-lgpd`               | `webpump_acesso_lgpd_l13709.html`                | Login / Cadastro do médico veterinário + consentimento LGPD (pública) |
| `/paciente-vet`               | `webpump_cadastro_do_paciente_vet.html`          | Cadastro clínico do paciente (espécie, peso, idade, ECC, hidratação) |
| `/modalidade-de-infusao`      | `webpump_modalidades_de_infus_o_carrossel.html`  | Carrossel de protocolos de infusão (Fluidoterapia / MLK / FLK)    |
| `/protocolo-farmacologico`    | `webpump_farmacologia_simulador_de_bomba.html`   | Composição da solução (4 fármacos) + simulador de bomba de infusão |
| `/simulador-de-bomba`         | *(mesma página acima)*                           | Redireciona para `/protocolo-farmacologico` — no protótipo original, o mesmo arquivo atendia aos itens "3. Protocolo Farmacológico" e "4. Simulador & Monitor" do menu lateral |

Todas as rotas clínicas (`paciente-vet`, `modalidade-de-infusao`,
`protocolo-farmacologico`) ficam dentro de um layout compartilhado
(`ShellComponent`, com o menu lateral + cabeçalho + rodapé) e são protegidas
por um **guard de autenticação** (`authGuard`). A rota `/acesso-lgpd` é a
única pública.

## Proteção de rotas (autenticação)

- `AuthService` (`src/app/core/services/auth.service.ts`) mantém uma sessão
  mock do médico veterinário em `sessionStorage` (não há backend real nesta
  entrega — o objetivo é demonstrar o mecanismo de proteção de rotas e o
  fluxo de consentimento LGPD exigido na tela de acesso).
- `authGuard` (`src/app/core/guards/auth.guard.ts`) bloqueia o acesso direto
  a qualquer rota clínica sem sessão ativa, redirecionando para
  `/acesso-lgpd` (preservando a URL de destino em `?redirectTo=`).
- Um botão "Sair" no cabeçalho/menu lateral encerra a sessão
  (`AuthService.logout()`), permitindo testar o guard novamente.

## Funcionalidades preservadas

- **Cadastro do Paciente**: seleção de espécie/porte, peso em kg/g (stepper +
  slider), idade com classificação automática de fase de vida, Escore de
  Condição Corporal (ECC 1–9), estado de hidratação/déficit, cálculo de
  superfície corporal (fórmula de Meeh), necessidade hídrica basal, taxa
  horária e gotejamento — tudo reativo via *getters* Angular.
- **Modalidade de Infusão**: carrossel responsivo (1/2/3 cards visíveis
  conforme a largura da tela), seleção de protocolo com destaque visual,
  indicadores, setas de navegação e tabela comparativa.
- **Protocolo Farmacológico & Simulador de Bomba**: 4 slots de fármacos com
  cálculo de CRI (Constant Rate Infusion), slot 4 opcional com toggle,
  resumo de preparo da seringa/bolsa, e o painel de hardware virtual da
  bomba (LCD, PURGE, BOLUS, MUTE, START/PAUSE/STOP, exportar PDF, imprimir
  etiqueta).
- **CSS/responsividade**: o tema Tailwind (cores, tipografia, espaçamentos)
  foi extraído programaticamente da configuração original e replicado em
  `tailwind.config.js`, preservando pixel a pixel o design system das 4
  páginas.

## Como executar

```bash
npm install
npm start
# ou: ng serve
```

A aplicação sobe em `http://localhost:4200`. Ao acessar qualquer rota
protegida sem estar autenticado, você será redirecionado para
`/acesso-lgpd` — faça login/cadastro (qualquer e-mail/senha, é um mock) e
aceite os termos da LGPD para prosseguir.

## Build de produção

```bash
npm run build
```

Os artefatos finais ficam em `dist/webpump-vet/`.

## Notas técnicas

- Angular standalone components (sem `NgModules`), lazy-loading por rota
  (`loadComponent`).
- `strict`/`strictTemplates` estão desligados no `tsconfig.json` para
  simplificar a migração inicial dos protótipos — podem ser reativados
  gradualmente.
- Os dados de exemplo ("Thor", 8.5 kg / 24.5 kg conforme a página) foram
  mantidos exatamente como no protótipo original, já que as páginas fonte
  não compartilhavam esse estado entre si de fato.
