
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe responsável pela conexão com o banco de dados.
 */
export class DatabaseModel {
    private _pool: pg.Pool;

    constructor() {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error(
                'A variável DATABASE_URL não foi configurada no ambiente.'
            );
        }

        this._pool = new pg.Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            max: 10,
            idleTimeoutMillis: 10000
        });

        this._pool.on('error', (error) => {
            console.error('Erro inesperado no pool do banco:', error);
        });
    }

    /**
     * Testa a conexão com o banco de dados.
     */
    public async testeConexao(): Promise<boolean> {
        try {
            await this._pool.query('SELECT 1');

            console.log('Database connected!');
            return true;
        } catch (error) {
            console.error('Erro ao conectar com o banco de dados:', error);
            return false;
        }
    }

    /**
     * Retorna o pool de conexões.
     */
    public get pool(): pg.Pool {
        return this._pool;
    }
}
