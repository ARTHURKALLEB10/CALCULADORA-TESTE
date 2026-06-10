let expr: string = '';
let novo: boolean = true;
let degMode: boolean = true;

const res = document.getElementById('res') as HTMLElement;
const histExpr = document.getElementById('histExpr') as HTMLElement;
const modeBtn = document.getElementById('modeBtn') as HTMLButtonElement;
const modeIndicator = document.getElementById('modeIndicator') as HTMLElement;

function toRad(x: number): number {
    return degMode ? x * Math.PI / 180 : x;
}

function fromRad(x: number): number {
    return degMode ? x * 180 / Math.PI : x;
}

function toggleMode(): void {
    degMode = !degMode;
    modeBtn.textContent = degMode ? 'DEG' : 'RAD';
    atualizar(expr || '0');
}

function factorial(n: number): number {
    n = Math.round(n);
    if (n < 0 || n > 170) return NaN;
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function wrapLast(fn: string): void {
    const m = expr.match(/([\d.]+|\))$/);
    if (!m) return;
    const token = m[1];
    expr = expr.slice(0, expr.length - token.length) + fn + '(' + token + ')';
    atualizar(expr);
}

function atualizar(v: string | number): void {
    res.textContent = String(v) || '0';
    modeIndicator.textContent = degMode ? '° DEG' : 'RAD';
}

function add(n: string): void {
    const isOperator = '+-*/%'.includes(n) || n === '**' || n.endsWith('(') || n === '(';
    if (novo && !isOperator) { expr = n; novo = false; }
    else { if (novo) novo = false; expr += n; }
    atualizar(expr);
}

function limpar(): void {
    expr = '';
    novo = true;
    histExpr.textContent = '';
    atualizar('0');
}

function apagar(): void {
    expr = expr.slice(0, -1);
    atualizar(expr || '0');
}

function ponto(): void {
    const parts = expr.split(/[\+\-\*\/\(\)]/);
    if (!parts[parts.length - 1].includes('.')) {
        expr += '.';
        atualizar(expr);
    }
}

function calcular(): void {
    try {
        const display = expr
            .replace(/_sin\(/g, 'sin(').replace(/_cos\(/g, 'cos(').replace(/_tan\(/g, 'tan(')
            .replace(/_asin\(/g, 'asin(').replace(/_acos\(/g, 'acos(').replace(/_atan\(/g, 'atan(')
            .replace(/_log\(/g, 'log(').replace(/_ln\(/g, 'ln(').replace(/_pow10\(/g, '10^(')
            .replace(/_sqrt\(/g, '√(').replace(/_sq\(/g, 'sq(').replace(/_fact\(/g, 'n!(')
            .replace(/_inv\(/g, '1/(').replace(/\*\*/g, '^').replace(/\*/g, '×').replace(/\//g, '÷');
        histExpr.textContent = display + ' =';

        const ctx: Record<string, unknown> = {
            _sin: (x: number) => Math.sin(toRad(x)),
            _cos: (x: number) => Math.cos(toRad(x)),
            _tan: (x: number) => Math.tan(toRad(x)),
            _asin: (x: number) => fromRad(Math.asin(x)),
            _acos: (x: number) => fromRad(Math.acos(x)),
            _atan: (x: number) => fromRad(Math.atan(x)),
            _log: (x: number) => Math.log10(x),
            _ln:  (x: number) => Math.log(x),
            _fact: factorial,
            _pow10: (x: number) => Math.pow(10, x),
            _sqrt: (x: number) => Math.sqrt(x),
            _sq:  (x: number) => x * x,
            _inv: (x: number) => 1 / x,
            PI: Math.PI,
            E:  Math.E,
        };

        const keys = Object.keys(ctx);
        const values = Object.values(ctx);
        const r: number = new Function(...keys, '"use strict"; return (' + expr + ')')(...values);
        const resultado = parseFloat(r.toFixed(10));
        atualizar(resultado);
        expr = String(resultado);
        novo = true;
    } catch {
        atualizar('Erro');
        expr = '';
        novo = true;
    }
}

// Expõe as funções globalmente para uso nos botões HTML
(window as Window & typeof globalThis & Record<string, unknown>).add = add;
(window as Window & typeof globalThis & Record<string, unknown>).limpar = limpar;
(window as Window & typeof globalThis & Record<string, unknown>).apagar = apagar;
(window as Window & typeof globalThis & Record<string, unknown>).ponto = ponto;
(window as Window & typeof globalThis & Record<string, unknown>).calcular = calcular;
(window as Window & typeof globalThis & Record<string, unknown>).toggleMode = toggleMode;
(window as Window & typeof globalThis & Record<string, unknown>).wrapLast = wrapLast;
