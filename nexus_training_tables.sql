-- SQL para criar as tabelas de treinamento no schema 'nexus'
-- Execute este script no SQL Editor do seu painel Supabase

-- 1. Tabela de Cursos
CREATE TABLE IF NOT EXISTS nexus.cursos (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    obrigatorio BOOLEAN DEFAULT TRUE,
    capa_url TEXT,
    data_criacao DATE DEFAULT CURRENT_DATE,
    contrato TEXT
);

-- 2. Tabela de Conteúdos (Vídeos)
CREATE TABLE IF NOT EXISTS nexus.cursos_conteudos (
    id BIGSERIAL PRIMARY KEY,
    curso_id BIGINT REFERENCES nexus.cursos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    url_video TEXT NOT NULL,
    ordem INT DEFAULT 0
);

-- 3. Tabela de Avaliações
CREATE TABLE IF NOT EXISTS nexus.avaliacoes (
    id BIGSERIAL PRIMARY KEY,
    curso_id BIGINT REFERENCES nexus.cursos(id) ON DELETE CASCADE,
    nota_minima INT DEFAULT 70,
    tentativas_maximas INT DEFAULT 3
);

-- 4. Tabela de Questões
CREATE TABLE IF NOT EXISTS nexus.questoes (
    id BIGSERIAL PRIMARY KEY,
    avaliacao_id BIGINT REFERENCES nexus.avaliacoes(id) ON DELETE CASCADE,
    enunciado TEXT NOT NULL
);

-- 5. Tabela de Opções de Resposta
CREATE TABLE IF NOT EXISTS nexus.opcoes (
    id BIGSERIAL PRIMARY KEY,
    questao_id BIGINT REFERENCES nexus.questoes(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    correta BOOLEAN DEFAULT FALSE
);

-- 6. Tabela de Resultados dos Treinamentos
CREATE TABLE IF NOT EXISTS nexus.resultados_treinamento (
    id BIGSERIAL PRIMARY KEY,
    funcionario_id BIGINT REFERENCES nexus.funcionarios(id) ON DELETE CASCADE,
    curso_id BIGINT REFERENCES nexus.cursos(id) ON DELETE CASCADE,
    nota INT NOT NULL,
    status TEXT NOT NULL, -- 'Aprovado' ou 'Reprovado'
    data_conclusao DATE DEFAULT CURRENT_DATE
);

-- Habilitar RLS (Row Level Security) para todas as tabelas
ALTER TABLE nexus.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexus.cursos_conteudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexus.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexus.questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexus.opcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexus.resultados_treinamento ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso (Permitindo tudo para anon por enquanto, ajuste conforme necessário)
CREATE POLICY "Allow all on cursos" ON nexus.cursos FOR ALL USING (true);
CREATE POLICY "Allow all on cursos_conteudos" ON nexus.cursos_conteudos FOR ALL USING (true);
CREATE POLICY "Allow all on avaliacoes" ON nexus.avaliacoes FOR ALL USING (true);
CREATE POLICY "Allow all on questoes" ON nexus.questoes FOR ALL USING (true);
CREATE POLICY "Allow all on opcoes" ON nexus.opcoes FOR ALL USING (true);
CREATE POLICY "Allow all on resultados_treinamento" ON nexus.resultados_treinamento FOR ALL USING (true);

-- SQL para criar o bucket 'videos' no Storage (Se o Supabase permitir via SQL)
-- Nota: Geralmente é melhor criar via interface do Supabase > Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
