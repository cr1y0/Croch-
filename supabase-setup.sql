-- ============================================================================
-- RANGEL LUXO ATELIER — CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE
-- ============================================================================
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- Ele criará as tabelas de pedidos e clientes com as devidas políticas de segurança (RLS).
-- ============================================================================

-- 1. TABELA DE PEDIDOS & ENCOMENDAS (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    date TEXT NOT NULL,
    items TEXT NOT NULL,
    total TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir que qualquer visitante anônimo envie pedidos (checkout, encomenda ou contato)
CREATE POLICY "Permitir insercao anonima de pedidos" 
ON public.orders 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política 2: Permitir leitura de pedidos pela chave anon/autenticada para o painel administrativo
CREATE POLICY "Permitir leitura de pedidos" 
ON public.orders 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Política 3: Permitir atualização de status dos pedidos pelo painel administrativo
CREATE POLICY "Permitir atualizacao de pedidos" 
ON public.orders 
FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);


-- 2. TABELA DE CLIENTES CADASTRADOS (clients)
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir cadastro anônimo de clientes
CREATE POLICY "Permitir cadastro de clientes" 
ON public.clients 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política 2: Permitir leitura de clientes para login e painel
CREATE POLICY "Permitir leitura de clientes" 
ON public.clients 
FOR SELECT 
TO anon, authenticated 
USING (true);


-- 3. DADOS INICIAIS DE DEMONSTRAÇÃO (Opcional - só insere se não existirem)
INSERT INTO public.orders (id, customer_name, contact, date, items, total, status)
VALUES 
  ('PED-4821', 'Helena Montenegro', '(27) 99881-2233', '30/09/2026', '6x Sousplat Verde Celadon Prime', 'R$ 390,00', 'Em Produção'),
  ('PED-4819', 'Carla Beatriz Souza', '(11) 98122-4455', '29/09/2026', '1x Trilho de Mesa Espiral Azul Celeste, 2x Sousplat Notte', 'R$ 350,00', 'Pendente'),
  ('PED-4805', 'Fernanda Lins', '(41) 99100-8877', '28/09/2026', '1x Trio Sousplat Terracota & Linho', 'R$ 180,00', 'Concluído')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clients (id, name, email, phone, role)
VALUES 
  ('usr-admin', 'Administradora Rangel', 'admin@rangeluxo.com.br', '(27) 99612-4303', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Notificação de sucesso
COMMENT ON TABLE public.orders IS 'Tabela de pedidos, encomendas e mensagens da landing page Rangel Luxo';
COMMENT ON TABLE public.clients IS 'Tabela de clientes e administradora da Rangel Luxo';
