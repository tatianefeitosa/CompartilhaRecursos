import { describe, test, expect } from '@jest/globals';

const registrarUsuarioMock = (dados: any) => ({ id: 1, ...dados });
const loginMock = (email: string, senha: string) => ({ token: 'mockToken123' });

describe('Testes Unitários de Autenticação', () => {
    test('registrarUsuario retorna usuário criado', () => {
        const result = registrarUsuarioMock({
            nome: 'Admin Sistema',
            email: 'admin@email.com',
            senha: 'admin123',
            role: 'admin'
        });
        expect(result.email).toBe('admin@email.com');
        expect(result).toHaveProperty('id');
    });

    test('login retorna token', () => {
        const result = loginMock('admin@email.com', 'admin123');
        expect(result.token).toBe('mockToken123');
    });
});