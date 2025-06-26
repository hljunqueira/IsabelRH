import { 
  pgTable, 
  text, 
  serial, 
  uuid, 
  timestamp, 
  varchar,
  pgEnum 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tipoUsuarioEnum = pgEnum('tipo_usuario', ['candidato', 'empresa']);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }).notNull(),
  tipo: tipoUsuarioEnum("tipo").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const candidatos = pgTable("candidatos", {
  id: uuid("id").primaryKey().references(() => usuarios.id),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  linkedin: varchar("linkedin", { length: 255 }),
  curriculoUrl: varchar("curriculo_url", { length: 500 }),
  areasInteresse: text("areas_interesse").array(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const empresas = pgTable("empresas", {
  id: uuid("id").primaryKey().references(() => usuarios.id),
  nome: varchar("nome", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }),
  setor: varchar("setor", { length: 100 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const vagas = pgTable("vagas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao").notNull(),
  requisitos: text("requisitos"),
  publicadoEm: timestamp("publicado_em").defaultNow().notNull(),
});

export const candidaturas = pgTable("candidaturas", {
  id: uuid("id").primaryKey().defaultRandom(),
  vagaId: uuid("vaga_id").references(() => vagas.id).notNull(),
  candidatoId: uuid("candidato_id").references(() => candidatos.id).notNull(),
  dataCandidatura: timestamp("data_candidatura").defaultNow().notNull(),
});

export const bancoTalentos = pgTable("banco_talentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  curriculoUrl: varchar("curriculo_url", { length: 500 }),
  areaInteresse: varchar("area_interesse", { length: 255 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const contatos = pgTable("contatos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  empresa: varchar("empresa", { length: 255 }),
  mensagem: text("mensagem").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

// Insert schemas
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  criadoEm: true,
});

export const insertCandidatoSchema = createInsertSchema(candidatos).omit({
  id: true,
  criadoEm: true,
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({
  id: true,
  criadoEm: true,
});

export const insertVagaSchema = createInsertSchema(vagas).omit({
  id: true,
  publicadoEm: true,
});

export const insertCandidaturaSchema = createInsertSchema(candidaturas).omit({
  id: true,
  dataCandidatura: true,
});

export const insertBancoTalentosSchema = createInsertSchema(bancoTalentos).omit({
  id: true,
  criadoEm: true,
});

export const insertContatoSchema = createInsertSchema(contatos).omit({
  id: true,
  criadoEm: true,
});

// Types
export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Candidato = typeof candidatos.$inferSelect;
export type InsertCandidato = z.infer<typeof insertCandidatoSchema>;
export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Vaga = typeof vagas.$inferSelect;
export type InsertVaga = z.infer<typeof insertVagaSchema>;
export type Candidatura = typeof candidaturas.$inferSelect;
export type InsertCandidatura = z.infer<typeof insertCandidaturaSchema>;
export type BancoTalentos = typeof bancoTalentos.$inferSelect;
export type InsertBancoTalentos = z.infer<typeof insertBancoTalentosSchema>;
export type Contato = typeof contatos.$inferSelect;
export type InsertContato = z.infer<typeof insertContatoSchema>;
