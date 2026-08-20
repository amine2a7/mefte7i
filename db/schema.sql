-- SecureKey database schema (plain PostgreSQL, no ORM).

DROP TABLE IF EXISTS status_history CASCADE;
DROP TABLE IF EXISTS demandes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS demande_kind CASCADE;
DROP TYPE IF EXISTS bien_type CASCADE;
DROP TYPE IF EXISTS urgence CASCADE;
DROP TYPE IF EXISTS demande_status CASCADE;

CREATE TYPE role AS ENUM ('AGENT', 'ADMIN');
CREATE TYPE demande_kind AS ENUM ('INCIDENT', 'COMMANDE');
CREATE TYPE bien_type AS ENUM ('VOITURE', 'MAISON');
CREATE TYPE urgence AS ENUM ('NORMAL', 'URGENT', 'TRES_URGENT');
CREATE TYPE demande_status AS ENUM ('EN_ATTENTE', 'EN_COURS', 'REJETE', 'VALIDE');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role role NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE demandes (
  id TEXT PRIMARY KEY,
  kind demande_kind NOT NULL,
  agent_id TEXT REFERENCES users(id),

  bien_type bien_type NOT NULL,

  -- Incident-specific
  problem_type TEXT,
  description TEXT,

  -- Commande-specific
  marque_modele_ou_serrure TEXT,
  annee_vehicule INTEGER,
  avec_programmation BOOLEAN,
  quantite INTEGER,
  mode_livraison TEXT,
  adresse_livraison TEXT,

  urgence urgence NOT NULL DEFAULT 'NORMAL',
  adresse_intervention TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  nom_contact TEXT NOT NULL,
  telephone_contact TEXT NOT NULL,
  email_contact TEXT NOT NULL,

  photos TEXT, -- JSON-encoded array of data URLs

  status demande_status NOT NULL DEFAULT 'EN_ATTENTE',
  montant DOUBLE PRECISION,
  raison_rejet TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX demandes_status_idx ON demandes(status);
CREATE INDEX demandes_kind_idx ON demandes(kind);
CREATE INDEX demandes_bien_type_idx ON demandes(bien_type);
CREATE INDEX demandes_agent_id_idx ON demandes(agent_id);

CREATE TABLE status_history (
  id TEXT PRIMARY KEY,
  demande_id TEXT NOT NULL REFERENCES demandes(id) ON DELETE CASCADE,
  status demande_status NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by_id TEXT REFERENCES users(id),
  note TEXT
);

CREATE INDEX status_history_demande_id_idx ON status_history(demande_id);
