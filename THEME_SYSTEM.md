# 🌗 Sistema de Temas Green API

## Funcionalidades Implementadas

### ✨ **Recursos de Acessibilidade**

- **Alternância Tema Escuro/Claro**: Botão intuitivo com ícones sol/lua
- **Persistência da Preferência**: Salva escolha do usuário no localStorage
- **Detecção Automática**: Respeita preferência do sistema operacional
- **Transições Suaves**: Animações fluidas entre temas
- **Acessibilidade Completa**:
  - Labels ARIA apropriados
  - Suporte a teclado
  - Contraste adequado em ambos os temas

### 🎨 **Onde Encontrar o Toggle**

1. **Tela de Login**: Canto superior direito
2. **Tela de Cadastro**: Canto superior direito
3. **Menu de Navegação**: Integrado entre os links

### 🔧 **Implementação Técnica**

#### **Componentes Criados**

- `ThemeContext.js`: Context React para gerenciamento de estado
- `ThemeToggle`: Componente reutilizável do botão
- Variáveis CSS personalizadas para cada tema

#### **Temas Disponíveis**

**🌙 Tema Escuro (Padrão)**

- Fundo: Preto profundo (#010101)
- Primário: Verde vibrante (#22C55E)
- Texto: Cinza claro (#d6d6d6)
- Imagem de fundo: bg.png

**☀️ Tema Claro**

- Fundo: Cinza muito claro (#f8fafc)
- Primário: Verde profundo (#16a34a)
- Texto: Azul escuro (#1e293b)
- Imagem de fundo: bg2.png

### 🚀 **Como Usar**

```jsx
// Para usar o contexto de tema
import { useTheme } from "@/contexts/ThemeContext";

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div>
      <p>Tema atual: {theme}</p>
      <button onClick={toggleTheme}>
        Alternar para {isDark ? "Claro" : "Escuro"}
      </button>
    </div>
  );
};
```

### 📱 **Responsividade**

- **Desktop**: Botão completo com texto e ícone
- **Tablet**: Versão compacta
- **Mobile**: Apenas ícone para economizar espaço

### 🎯 **Benefícios de Acessibilidade**

✅ **Redução de Fadiga Ocular**: Tema escuro para ambientes com pouca luz  
✅ **Melhor Legibilidade**: Tema claro para leitura durante o dia  
✅ **Personalização**: Usuário escolhe sua preferência  
✅ **Economia de Bateria**: Tema escuro em telas OLED  
✅ **Inclusão**: Atende diferentes necessidades visuais

### 🔄 **Funcionamento Automático**

1. **Primeira visita**: Detecta preferência do sistema
2. **Visitas seguintes**: Carrega tema salvo do localStorage
3. **Mudança manual**: Salva imediatamente a nova preferência
4. **Transições**: Aplicadas suavemente sem quebra de layout

---

## 🛠️ **Manutenção e Extensão**

Para adicionar novos componentes que respondem ao tema:

1. Use as variáveis CSS `var(--color-name)`
2. Adicione novas variáveis em `globals.css` se necessário
3. Teste em ambos os temas para garantir contraste adequado

**Arquivo de configuração principal**: `src/styles/globals.css`
