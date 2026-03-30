import express from "express";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase
const supabaseUrl = "https://teca-admin-supabase.ly7t0m.easypanel.host";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'nexus' }
});

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- API ROUTES ---

// AUTH API
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Tentativa de login para o usuário: ${username}`);
  
  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ success: false, message: "Erro de configuração no servidor (Supabase URL/Key faltando)" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error) {
      console.error("Erro no Supabase ao buscar usuário:", error.message);
      let friendlyMessage = `Erro no banco de dados: ${error.message}`;
      if (error.message.includes("fetch failed")) {
        friendlyMessage = "Não foi possível conectar ao servidor do Supabase (Easypanel). Verifique se ele está online.";
      } else if (error.code === "PGRST116") {
        friendlyMessage = "Usuário ou senha incorretos";
      }
      return res.status(401).json({ 
        success: false, 
        message: friendlyMessage 
      });
    }

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }
  } catch (err: any) {
    console.error("Erro crítico no servidor durante o login:", err);
    res.status(500).json({ success: false, message: "Erro interno no servidor" });
  }
});

// RH API
app.get("/api/funcionarios", async (req, res) => {
  const { contrato } = req.query;
  let query = supabase.from("funcionarios").select("*");
  
  if (contrato) {
    query = query.eq("contrato", contrato);
  }
  
  const { data: list, error } = await query;
  if (error) {
    console.error("Erro ao buscar funcionários:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
  
  const processedList = list?.map(f => ({
    ...f,
    status: f.status || "Ativo"
  })) || [];
  
  res.json(processedList);
});

app.get("/api/funcionarios/matricula/:matricula", async (req, res) => {
  const { data: funcionario, error } = await supabase
    .from("funcionarios")
    .select("*")
    .eq("matricula", req.params.matricula)
    .single();

  if (error) {
    return res.status(404).json({ success: false, message: "Matrícula não encontrada" });
  }
  res.json({ success: true, funcionario });
});

app.post("/api/funcionarios", async (req, res) => {
  const { nome, cpf, rg, data_nascimento, matricula, data_admissao, cargo, email, telefone, contrato, foto } = req.body;
  try {
    const { data: func, error: fErr } = await supabase
      .from("funcionarios")
      .insert([{ 
        nome, 
        cpf, 
        rg, 
        data_nascimento, 
        matricula, 
        data_admissao, 
        cargo, 
        email, 
        telefone, 
        contrato,
        foto,
        status: "Ativo"
      }])
      .select()
      .single();

    if (fErr) throw fErr;

    res.json({ success: true, id: func.id });
  } catch (e: any) {
    console.error("Erro ao criar funcionário:", e.message);
    res.status(400).json({ success: false, message: e.message });
  }
});

app.get("/api/funcionarios/:id", async (req, res) => {
  const id = req.params.id;
  
  const [
    { data: funcionario, error: fErr },
    { data: sst },
    { data: escala },
    { data: treinamentos }
  ] = await Promise.all([
    supabase.from("funcionarios").select("*").eq("id", id).single(),
    supabase.from("sst_asos").select("*").eq("funcionario_id", id).order("data_vencimento", { ascending: false }),
    supabase.from("escalas").select("*").eq("funcionario_id", id).order("data", { ascending: false }).limit(5),
    supabase.from("resultados_treinamento").select(`nota, status, data_conclusao, cursos ( nome )`).eq("funcionario_id", id)
  ]);

  if (fErr) {
    return res.status(404).json({ success: false, message: "Funcionário não encontrado" });
  }

  const funcionarioComStatus = {
    ...funcionario,
    status: funcionario.status || "Ativo"
  };

  const formattedTreinamentos = treinamentos?.map((t: any) => ({
    nome: t.cursos?.nome || "Curso Removido",
    nota: t.nota,
    status: t.status,
    data_conclusao: t.data_conclusao
  })) || [];

  // Mock RH data if not found in funcionarios (fallback for old schema if needed, but here we assume new schema)
  const rh = {
    email: funcionario.email,
    telefone: funcionario.telefone,
    endereco: funcionario.endereco || "Não informado"
  };

  res.json({ funcionario: funcionarioComStatus, rh, sst, escala, treinamentos: formattedTreinamentos });
});

app.put("/api/funcionarios/:id", async (req, res) => {
  const { nome, cpf, rg, data_nascimento, matricula, data_admissao, cargo, email, telefone, contrato, foto } = req.body;
  try {
    const { error } = await supabase
      .from("funcionarios")
      .update({ 
        nome, 
        cpf, 
        rg, 
        data_nascimento, 
        matricula, 
        data_admissao, 
        cargo, 
        email, 
        telefone, 
        contrato,
        foto 
      })
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (e: any) {
    console.error("Erro ao atualizar funcionário:", e.message);
    res.status(400).json({ success: false, message: e.message });
  }
});

// SST API
app.post("/api/sst/aso", async (req, res) => {
  const { funcionario_id, data_realizacao, data_vencimento, tipo } = req.body;
  const today = new Date().toISOString().split('T')[0];
  let status = "Válido";
  if (data_vencimento < today) status = "Vencido";
  else {
    const diff = Math.ceil((new Date(data_vencimento).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 30) status = "Vencendo";
  }

  const { error } = await supabase
    .from("sst_asos")
    .insert([{ funcionario_id, data_realizacao, data_vencimento, tipo, status }]);

  res.json({ success: !error });
});

// ESCALA API
app.post("/api/escalas", async (req, res) => {
  const { funcionario_id, data, turno, horario_inicio, horario_fim, local, funcao } = req.body;
  const { data: conflict } = await supabase.from("escalas").select("*").eq("funcionario_id", funcionario_id).eq("data", data).single();

  if (conflict) {
    return res.status(400).json({ success: false, message: "Funcionário já possui escala para este dia." });
  }

  const { error } = await supabase.from("escalas").insert([{ funcionario_id, data, turno, horario_inicio, horario_fim, local, funcao }]);
  if (!error) {
    await supabase.from("funcionarios").update({ status: "Alocado" }).eq("id", funcionario_id);
  }
  res.json({ success: !error });
});

// TREINAMENTO API
app.get("/api/cursos", async (req, res) => {
  const { contrato } = req.query;
  let query = supabase.from("cursos").select("*");
  if (contrato) query = query.eq("contrato", contrato);
  let { data: list, error } = await query;
  
  if (error && error.code === '42P01') {
    let queryT = supabase.from("treinamentos").select("*");
    if (contrato) queryT = queryT.eq("contrato", contrato);
    const result = await queryT;
    list = result.data;
  }
  
  res.json(list || []);
});

app.post("/api/cursos", async (req, res) => {
  const { nome, descricao, data_inicio, data_fim, capa_url } = req.body;
  const today = new Date().toISOString().split('T')[0];
  
  let { data, error } = await supabase
    .from("cursos")
    .insert([{ nome, descricao: descricao || "", data_inicio, data_fim, obrigatorio: true, capa_url: capa_url || null, data_criacao: today }])
    .select()
    .single();

  if (error && error.code === '42P01') {
    const result = await supabase
      .from("treinamentos")
      .insert([{ nome, descricao: descricao || "", data_inicio, data_fim, obrigatorio: true, capa_url: capa_url || null, data_criacao: today }])
      .select()
      .single();
    data = result.data;
    error = result.error;
  }

  res.json({ success: !error, id: data?.id });
});

app.put("/api/cursos/:id", async (req, res) => {
  const { nome, data_inicio, data_fim, capa_url } = req.body;
  let { error } = await supabase.from("cursos").update({ nome, data_inicio, data_fim, capa_url }).eq("id", req.params.id);
  
  if (error && error.code === '42P01') {
    const result = await supabase.from("treinamentos").update({ nome, data_inicio, data_fim, capa_url }).eq("id", req.params.id);
    error = result.error;
  }
  
  res.json({ success: !error });
});

app.get("/api/cursos/:id/conteudo", async (req, res) => {
  const [conteudosResult, avaliacaoResult] = await Promise.all([
    supabase.from("cursos_conteudos").select("*").eq("curso_id", req.params.id).order("ordem"),
    supabase.from("avaliacoes").select("*").eq("curso_id", req.params.id).single()
  ]);

  let conteudos = conteudosResult.data;
  if (conteudosResult.error && conteudosResult.error.code === '42P01') {
    const result = await supabase.from("treinamento_conteudos").select("*").eq("curso_id", req.params.id).order("ordem");
    conteudos = result.data;
  }

  const avaliacao = avaliacaoResult.data;

  let formattedQuestoes = [];
  if (avaliacao) {
    const { data: questoes } = await supabase.from("questoes").select("*").eq("avaliacao_id", avaliacao.id);
    if (questoes) {
      formattedQuestoes = await Promise.all(questoes.map(async (q: any) => {
        const { data: opcoes } = await supabase.from("opcoes").select("*").eq("questao_id", q.id);
        return { ...q, opcoes: opcoes || [] };
      }));
    }
  }
  res.json({ conteudos: conteudos || [], avaliacao, questoes: formattedQuestoes });
});

app.post("/api/cursos/conteudo", async (req, res) => {
  const { curso_id, titulo, url_video, ordem } = req.body;
  console.log(`Tentando salvar vídeo: ${titulo} para o curso ${curso_id}`);
  
  // Try 'cursos_conteudos' first, then 'treinamento_conteudos' as fallback
  let { error } = await supabase.from("cursos_conteudos").insert([{ curso_id, titulo, url_video, ordem }]);
  
  if (error && error.code === '42P01') { // Relation does not exist
    console.log("Tabela 'cursos_conteudos' não encontrada, tentando 'treinamento_conteudos'...");
    const result = await supabase.from("treinamento_conteudos").insert([{ curso_id, titulo, url_video, ordem }]);
    error = result.error;
  }
  
  if (error) {
    console.error("Erro ao inserir conteúdo no Supabase:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
  
  res.json({ success: true });
});

app.delete("/api/cursos/conteudo/:id", async (req, res) => {
  let { error } = await supabase.from("cursos_conteudos").delete().eq("id", req.params.id);
  
  if (error && error.code === '42P01') {
    const result = await supabase.from("treinamento_conteudos").delete().eq("id", req.params.id);
    error = result.error;
  }
  
  res.json({ success: !error });
});

app.post("/api/cursos/avaliacao", async (req, res) => {
  const { curso_id, nota_minima, tentativas_maximas, questoes } = req.body;
  try {
    const { data: existing } = await supabase.from("avaliacoes").select("id").eq("curso_id", curso_id).single();
    if (existing) await supabase.from("avaliacoes").delete().eq("id", existing.id);

    const { data: aval, error: aErr } = await supabase.from("avaliacoes").insert([{ curso_id, nota_minima, tentativas_maximas }]).select().single();
    if (aErr) throw aErr;

    for (const q of questoes) {
      const { data: quest, error: qErr } = await supabase.from("questoes").insert([{ avaliacao_id: aval.id, enunciado: q.enunciado }]).select().single();
      if (qErr) throw qErr;
      const opcoesToInsert = q.opcoes.map((opt: any) => ({ questao_id: quest.id, texto: opt.texto, correta: opt.correta ? true : false }));
      await supabase.from("opcoes").insert(opcoesToInsert);
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
});

app.post("/api/treinamentos/responder", async (req, res) => {
  const { funcionario_id, curso_id, nota } = req.body;
  
  let { data: results, error: rErr } = await supabase.from("resultados_treinamento").select("status").eq("funcionario_id", funcionario_id).eq("curso_id", curso_id);
  
  if (rErr && rErr.code === '42P01') {
    const result = await supabase.from("treinamento_resultados").select("status").eq("funcionario_id", funcionario_id).eq("curso_id", curso_id);
    results = result.data;
  }

  const isApproved = results?.some((r: any) => r.status === "Aprovado");
  const reprovadoCount = results?.filter((r: any) => r.status === "Reprovado").length || 0;
  
  if (isApproved) return res.status(400).json({ success: false, message: "Você já foi aprovado neste curso." });
  if (reprovadoCount >= 3) return res.status(400).json({ success: false, message: "Limite de tentativas excedido (3)." });

  const { data: avaliacao } = await supabase.from("avaliacoes").select("*").eq("curso_id", curso_id).single();
  const status = nota >= (avaliacao?.nota_minima || 0) ? "Aprovado" : "Reprovado";
  const today = new Date().toISOString().split('T')[0];
  
  let { error } = await supabase.from("resultados_treinamento").insert([{ funcionario_id, curso_id, nota, status, data_conclusao: today }]);
  
  if (error && error.code === '42P01') {
    const result = await supabase.from("treinamento_resultados").insert([{ funcionario_id, curso_id, nota, status, data_conclusao: today }]);
    error = result.error;
  }

  res.json({ success: !error, status });
});

app.get("/api/treinamentos/resultados", async (req, res) => {
  const { funcionario_id } = req.query;
  let query = supabase.from("resultados_treinamento").select(`id, nota, status, data_conclusao, curso_id, funcionario_id, funcionarios ( nome, matricula ), cursos ( nome )`).order("id", { ascending: false });
  if (funcionario_id) query = query.eq("funcionario_id", funcionario_id);
  const { data: results } = await query;
  const processedResults = results?.map((r: any) => {
    const courseAttempts = results.filter((r2: any) => r2.funcionario_id === r.funcionario_id && r2.curso_id === r.curso_id && r2.id <= r.id);
    return { id: r.id, funcionario_nome: r.funcionarios.nome, matricula: r.funcionarios.matricula, curso_nome: r.cursos.nome, nota: r.nota, status: r.status, data_conclusao: r.data_conclusao, curso_id: r.curso_id, tentativa: courseAttempts.length };
  }) || [];
  res.json(processedResults);
});

app.get("/api/dashboard", async (req, res) => {
  const { contrato } = req.query;

  // Busca apenas funcionários, que é a única tabela que temos no momento
  let query = supabase.from("funcionarios").select("id, nome, matricula, cargo, contrato, status");
  if (contrato) query = query.eq("contrato", contrato);
  
  const { data: allFuncionarios } = await query;
  const processedFuncionarios = allFuncionarios?.map(f => ({
    ...f,
    status: f.status || "Ativo"
  })) || [];

  // Retorna os dados disponíveis e zera os que dependem de tabelas removidas
  res.json({ 
    totalFuncionarios: processedFuncionarios.length, 
    asosVencidos: 0, 
    semEscala: 0, 
    treinamentosPendentes: 0,
    atividades: [],
    alertas: [],
    listas: {
      totalFuncionarios: processedFuncionarios,
      asosVencidos: [],
      semEscala: [],
      treinamentosPendentes: []
    }
  });
});

app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  const { data: results } = await supabase.from("funcionarios").select("id, nome, matricula, cpf, cargo").or(`nome.ilike.%${q}%,matricula.eq.${q},cpf.eq.${q}`);
  res.json(results || []);
});

// CONFIG API
app.get("/api/config/supabase", (req, res) => {
  res.json({
    url: supabaseUrl,
    key: supabaseKey
  });
});

// DIAGNOSTIC API
app.get("/api/debug/tables", async (req, res) => {
  const { data, error } = await supabase.rpc('get_tables_info');
  if (error) {
    // Fallback if RPC doesn't exist
    const { data: tables, error: tErr } = await supabase.from("pg_tables").select("tablename").eq("schemaname", "nexus");
    return res.json({ error, tErr, tables });
  }
  res.json(data);
});

export default app;
