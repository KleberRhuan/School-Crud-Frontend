interface PasswordStrengthResult {
    score: number;
    maxScore: number;
    percentage: number;
    label: string;
    color: 'error' | 'warning' | 'info' | 'success';
    feedback: string[];
    suggestions: string[];
    estimatedCrackTime: string;
}

/* ---------- static data ---------- */

const COMMON_PASSWORDS = new Set(
    [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', '12345678',
        'dragon', 'monkey', 'password1', 'qwerty123'
    ].map(p => p.toLowerCase())
);

// @ts-ignore
const COMMON_PATTERNS: RegExp[] = [
    /^(.)\1+$/,                                              // all equal
    /^(?:012|123|234|345|456|567|678|789|890)+$/,            // numeric seq
    /^(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i, // alpha seq
    /^(.{1,3})\1+$/ // repeating group
];

const KEYBOARD_PATTERNS = [
    'qwerty', 'asdf', 'zxcv', '1234', 'qwertyuiop',
    'asdfghjkl', 'zxcvbnm', '!@#$%^&*()'
].map(k => k.toLowerCase());

/* ---------- strength helpers ---------- */

const STRENGTH_STEPS = [
    { limit: 30, label: 'Muito Fraca', color: 'error' },
    { limit: 50, label: 'Fraca',       color: 'error' },
    { limit: 70, label: 'Média',       color: 'warning' },
    { limit: 85, label: 'Boa',         color: 'info'   }
] as const;

const strengthFromPercentage = (pct: number) =>
    STRENGTH_STEPS.find(s => pct < s.limit) ??
    { label: 'Muito Forte', color: 'success' as const };

/* ---------- main entry ---------- */

export const getPasswordStrength = (password: string): PasswordStrengthResult => {

    if (!password) {
        return emptyResult(['Senha é obrigatória'], ['Digite uma senha']);
    }

    const lower = password.toLowerCase();
    const len   = password.length;
    let   score = 0;
    const feedback: string[]    = [];
    const suggestions: string[] = [];

    const lenPoints =
        len >= 16 ? 3 : len >= 12 ? 2 : len >=  8 ? 1 : 0;
    score += lenPoints;

    if (lenPoints === 0) suggestions.push(`Adicione ${8 - len} caracteres (mínimo 8)`);
    if (lenPoints === 1) suggestions.push('Considere usar pelo menos 12 caracteres');
    if (lenPoints) feedback.push('✓ Bom comprimento');

    const sets: Array<[RegExp,string,string]> = [
        [/[a-z]/ , '✓ Contém letras minúsculas', 'Adicione letras minúsculas (a-z)'],
        [/[A-Z]/ , '✓ Contém letras maiúsculas', 'Adicione letras maiúsculas (A-Z)'],
        [/[0-9]/ , '✓ Contém números',           'Adicione números (0-9)'],
        [/[^A-Za-z0-9]/,'✓ Contém caracteres especiais','Adicione caracteres especiais (!@#$%^&*)']
    ];

    sets.forEach(([re, ok, hint]) => {
        if (re.test(password)) {
            score++; feedback.push(ok);
        } else {
            suggestions.push(hint);
        }
    });

    const unique = countUnique(password);
    const entropyRatio = unique / len;
    if (entropyRatio > 0.7) { score++; feedback.push('✓ Boa variedade de caracteres'); }
    if (unique >= 8)        { score++; feedback.push('✓ Muitos caracteres únicos'); }
    else                    suggestions.push('Use mais caracteres diferentes');

    let penalties = 0;

    if (COMMON_PASSWORDS.has(lower)) {
        penalties += 2;
        feedback.push('⚠ Senha muito comum');
        suggestions.push('Evite senhas comuns como "password" ou "123456"');
    }

    if (COMMON_PATTERNS.some(re => re.test(password))) {
        penalties++;
        feedback.push('⚠ Contém padrão previsível');
        suggestions.push('Evite sequências ou repetições óbvias');
    }

    if (KEYBOARD_PATTERNS.some(k => lower.includes(k))) {
        penalties++;
        feedback.push('⚠ Contém sequência de teclado');
        suggestions.push('Evite sequências do teclado como "qwerty"');
    }

    if (/(.)\1{2,}/.test(password)) {
        penalties++;
        feedback.push('⚠ Muitos caracteres repetidos');
        suggestions.push('Evite caracteres repetidos consecutivos');
    }

    score = Math.max(0, score - penalties);
    const maxScore   = 10;
    const percentage = Math.round((score / maxScore) * 100);
    const { label, color } = strengthFromPercentage(percentage);
    const estimatedCrackTime = crackTime(password);

    return { score, maxScore, percentage, label, color, feedback, suggestions, estimatedCrackTime };
};

/* ---------- helpers ---------- */

const emptyResult = (fb: string[], sug: string[]): PasswordStrengthResult => ({
    score: 0,
    maxScore: 10,
    percentage: 0,
    label: 'Muito Fraca',
    color: 'error',
    feedback: fb,
    suggestions: sug,
    estimatedCrackTime: 'Instantâneo'
});

const countUnique = (str: string) => {
    const seen = new Uint8Array(65536); // covers UTF-16
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (!seen[code]) { seen[code] = 1; count++; }
    }
    return count;
};

const getCharsetSize = (pw: string) =>
    (/[a-z]/.test(pw) ? 26 : 0) +
    (/[A-Z]/.test(pw) ? 26 : 0) +
    (/[0-9]/.test(pw) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 32 : 0);

const crackTime = (pw: string): string => {
    const combos   = BigInt(getCharsetSize(pw)) ** BigInt(pw.length);
    const rate     = 1_000_000_000n;
    const seconds  = combos / (rate * 2n);

    if (seconds < 1n)               return 'Instantâneo';
    if (seconds < 60n)              return 'Segundos';
    if (seconds < 3_600n)           return 'Minutos';
    if (seconds < 86_400n)          return 'Horas';
    if (seconds < 2_592_000n)       return 'Dias';
    if (seconds < 31_536_000n)      return 'Meses';
    return 'Anos';
};