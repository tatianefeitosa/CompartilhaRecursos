import request from 'supertest';
import { app } from '../src/index';
import { AppDataSource, initializeDatabase } from '../src/config/database';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

describe('Testes de Integração de Autenticação', () => {

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await initializeDatabase();
        }
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });
    
    test('POST /auth/registro deve criar usuário', async () => {
        const emailAleatorio = `teste${Date.now()}@email.com`;
        
        const res = await request(app).post('/auth/registro').send({
            nome: 'João Silva',
            email: emailAleatorio,
            senha: 'senha123', // atende ao min(6) do schema
            role: 'estudante'  // CORRIGIDO
        });

        if (res.statusCode !== 201) {
            console.log("ERRO:", JSON.stringify(res.body, null, 2));
        }

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('mensagem', 'Usuário registrado com sucesso');
    });

    test('POST /auth/login deve retornar erro com senha errada', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'emailinexistente@teste.com',
            senha: 'senhaerrada'
        });

        expect(res.statusCode).toBe(401);
    });
});