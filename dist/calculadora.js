"use strict";
let expr = '';
let novo = true;
let degMode = true;
const res = document.getElementById('res');
const histExpr = document.getElementById('histExpr');
const modeBtn = document.getElementById('modeBtn');
const modeIndicator = document.getElementById('modeIndicator');
function toRad(x) {
    return degMode ? x * Math.PI / 180 : x;
}
function fromRad(x) {
    return degMode ? x * 180 / Math.PI : x;
}
function toggleMode() {
    degMode = !degMode;
    modeBtn.textContent = degMode ? 'DEG' : 'RAD';
    atualizar(expr || '0');
}
function factorial(n) {
    n = Math.round(n);
    if (n < 0 || n > 170)
        return NaN;
    if (n <= 1)
        return 1;
    let r = 1;
    for (let i = 2; i <= n; i++)
        r *= i;
    return r;
}
function wrapLast(fn) {
    const m = expr.match(/([\d.]+|\))$/);
    if (!m)
        return;
    const token = m[1];
    expr = expr.slice(0, expr.length - token.length) + fn + '(' + token + ')';
    atualizar(expr);
}
function atualizar(v) {
    res.textContent = String(v) || '0';
    modeIndicator.textContent = degMode ? '° DEG' : 'RAD';
}
function add(n) {
    const isOperator = '+-*/%'.includes(n) || n === '**' || n.endsWith('(') || n === '(';
    if (novo && !isOperator) {
        expr = n;
        novo = false;
    }
    else {
        if (novo)
            novo = false;
        expr += n;
    }
    atualizar(expr);
}
function limpar() {
    expr = '';
    novo = true;
    histExpr.textContent = '';
    atualizar('0');
}
function apagar() {
    expr = expr.slice(0, -1);
    atualizar(expr || '0');
}
function ponto() {
    const parts = expr.split(/[\+\-\*\/\(\)]/);
    if (!parts[parts.length - 1].includes('.')) {
        expr += '.';
        atualizar(expr);
    }
}
function calcular() {
    try {
        const display = expr
            .replace(/_sin\(/g, 'sin(').replace(/_cos\(/g, 'cos(').replace(/_tan\(/g, 'tan(')
            .replace(/_asin\(/g, 'asin(').replace(/_acos\(/g, 'acos(').replace(/_atan\(/g, 'atan(')
            .replace(/_log\(/g, 'log(').replace(/_ln\(/g, 'ln(').replace(/_pow10\(/g, '10^(')
            .replace(/_sqrt\(/g, '√(').replace(/_sq\(/g, 'sq(').replace(/_fact\(/g, 'n!(')
            .replace(/_inv\(/g, '1/(').replace(/\*\*/g, '^').replace(/\*/g, '×').replace(/\//g, '÷');
        histExpr.textContent = display + ' =';
        const ctx = {
            _sin: (x) => Math.sin(toRad(x)),
            _cos: (x) => Math.cos(toRad(x)),
            _tan: (x) => Math.tan(toRad(x)),
            _asin: (x) => fromRad(Math.asin(x)),
            _acos: (x) => fromRad(Math.acos(x)),
            _atan: (x) => fromRad(Math.atan(x)),
            _log: (x) => Math.log10(x),
            _ln: (x) => Math.log(x),
            _fact: factorial,
            _pow10: (x) => Math.pow(10, x),
            _sqrt: (x) => Math.sqrt(x),
            _sq: (x) => x * x,
            _inv: (x) => 1 / x,
            PI: Math.PI,
            E: Math.E,
        };
        const keys = Object.keys(ctx);
        const values = Object.values(ctx);
        const r = new Function(...keys, '"use strict"; return (' + expr + ')')(...values);
        const resultado = parseFloat(r.toFixed(10));
        atualizar(resultado);
        expr = String(resultado);
        novo = true;
    }
    catch (_a) {
        atualizar('Erro');
        expr = '';
        novo = true;
    }
}
// Expõe as funções globalmente para uso nos botões HTML
window.add = add;
window.limpar = limpar;
window.apagar = apagar;
window.ponto = ponto;
window.calcular = calcular;
window.toggleMode = toggleMode;
window.wrapLast = wrapLast;
