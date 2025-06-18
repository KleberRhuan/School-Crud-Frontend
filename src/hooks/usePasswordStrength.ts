import { useMemo } from 'react'
import { getPasswordStrength } from "@hooks/utils/PasswordStrengthUtil.ts"

export const usePasswordStrength = (password: string) => {
    const strength = useMemo(() => {
        return getPasswordStrength(password)
    }, [password])

    const isStrong = strength.score >= 7
    const isAcceptable = strength.score >= 5

    return {
        ...strength,
        isStrong,
        isAcceptable,
        progressColor: strength.color,
        progressValue: strength.percentage,
        hasMinimumStrength: strength.score >= 4,
        getScoreText: () => `${strength.score}/${strength.maxScore}`,
        getCrackTimeIcon: () => {
            switch (strength.estimatedCrackTime) {
                case 'Instantâneo':
                case 'Segundos': return '⚡'
                case 'Minutos': return '⏱️'
                case 'Horas': return '🕒'
                case 'Dias': return '📅'
                case 'Meses': return '📆'
                case 'Anos': return '🔒'
                default: return '🔐'
            }
        }
    }
}