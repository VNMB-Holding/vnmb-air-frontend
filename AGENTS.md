# Instruções para agentes

Este projeto usa Next.js 16 e Hero UI 3 como base principal de interface.

## Regras principais
- Sempre que for implementar ou ajustar interface, priorize componentes do Hero UI importados de `@heroui/react`.
- Prefira componentes como `Button`, `Input`, `TextField`, `Select`, `Tabs`, `Modal`, `Drawer`, `Avatar`, `Badge`, `Card`, `Accordion`, `DatePicker`, `Calendar`, `Toast` e outros componentes da biblioteca quando fizer sentido.
- Use as props nativas do Hero UI para `variant`, `color`, `size`, `radius` e `isDisabled` sempre que possível.
- Mantenha consistência visual com o restante do projeto e reutilize padrões já existentes nas pastas `app/` e `components/`.
- Evite criar componentes de UI personalizados quando houver um equivalente do Hero UI.
- Para estilização, combine props do Hero UI com classes do Tailwind somente quando necessário; prefira a abordagem nativa da biblioteca antes de criar CSS customizado.
- Considere acessibilidade e suporte a temas claros/escuros ao construir novos elementos.

## Referência
- Consulte a documentação dos componentes do Hero UI para escolher a implementação mais adequada antes de criar uma interface manual.
- Para formulários, prefira `TextField`, `Label`, `FieldError` e componentes de entrada do Hero UI.
- Para feedback ao usuário, prefira `toast` e componentes de feedback do Hero UI.

## Exemplos de uso
- `Button` -> usar `variant`, `size`, `fullWidth`, `isDisabled` e `onPress` para ações principais; preferir `variant="secondary"` ou `tertiary` para ações complementares e `variant="danger"` para remoções.
- `ButtonGroup` -> agrupar ações relacionadas como "Salvar / Cancelar", "Anterior / Próximo" ou "Editar / Excluir"; usar `variant`, `size` e `orientation` para manter consistência visual.
- `ToggleButton`/`ToggleButtonGroup` -> usar para opções de ativar/desativar ou selecionar uma ou mais opções; preferir `selectionMode="single"` para escolhas exclusivas e `selectionMode="multiple"` para filtros ou atalhos.
- `Dropdown` -> usar para menus de ações, opções rápidas ou seleção contextual; preferir `Dropdown.Item` com `variant="danger"` para ações destrutivas e `Dropdown.Section` para organizar itens.
- `ListBox` -> usar para listas de opções selecionáveis, como filtros, perfis ou itens de ação; preferir `selectionMode="single"` ou `multiple` conforme o comportamento esperado.
- `TagGroup` -> usar para filtros, categorias ou chips de seleção; preferir `selectionMode="single"` para categorias exclusivas e `multiple` para múltiplas escolhas.
- `Badge` -> usar para indicar notificações, status ou contagens junto a avatar, botão ou ícone; combinar `color`, `size`, `variant` e `placement` para manter legibilidade.
- `Chip` -> usar para estados, categorias ou pequenas etiquetas; preferir `color` e `variant` para diferenciar status como ativo, pendente ou erro.
- `Table` -> usar para exibir listas estruturadas de dados, preferindo `Table.Content`, `Table.Header`, `Table.Body`, `Table.Row` e `Table.Cell` com suporte a seleção, ordenação e paginação quando necessário.
- `Alert` -> usar para mensagens de sucesso, aviso ou erro com `status`, `Alert.Title` e `Alert.Description`; incluir ação quando a mensagem exigir resposta do usuário.
- `Meter`, `ProgressBar` e `ProgressCircle` -> usar para indicar progresso, uso de recurso ou carga; preferir `value`, `color` e `size` para manter consistência.
- `Skeleton` e `Spinner` -> usar para estados de carregamento e preenchimento antecipado de conteúdo.
- `Checkbox` e `CheckboxGroup` -> usar para escolhas múltiplas e listas de preferências; preferir `Description` para ajudar o usuário e `FieldError`/`ErrorMessage` para validação.
- `TextField`/`Input` -> preferir labels claras e `placeholder` objetivo.
- `InputGroup` -> usar dentro de `TextField` para inputs com prefixo/sufixo, como ícones, valores monetários, botão de copiar, toggle de senha ou `InputGroup.TextArea` para texto multilinha.
- `InputOTP` -> usar para códigos de verificação com 4-6 dígitos; preferir `maxLength`, `pattern`, `isInvalid` e `onComplete` para UX de OTP.
- `NumberField` -> usar para valores numéricos com `minValue`, `maxValue`, `step`, `formatOptions` e botões de incremento/decremento.
- `SearchField` -> usar para buscas com ícone de lupa, botão de limpar e suporte a teclado.
- `Select` -> usar para listas curtas e opções bem definidas.
- `Tabs` -> usar para alternar entre vistas relacionadas.
- `AlertDialog` -> usar para confirmações críticas, remoções ou ações destrutivas; manter botões explícitos e `isDismissable`/`isKeyboardDismissDisabled` conforme a necessidade.
- `Modal` -> usar para diálogos, formulários e conteúdo complementar; manter `Header`, `Body`, `Footer` e `CloseTrigger` consistentes.
- `Toast` -> usar para feedback rápido de sucesso, erro ou aviso.

> Estas instruções são a fonte única para Copilot e outros agentes no repositório.
