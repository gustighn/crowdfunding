#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec};

// Struktur data yang akan menyimpan notes
#[contracttype]
#[derive(Clone, Debug)]
pub struct Campaign {
    id : u64,
    title: String,
    description: String,
    target: u64,
    raised: u64,
    owner: Address,
    deadline: u64,
}

// Storage key untuk data notes
const CAMPAIGN_DATA: Symbol = symbol_short!("CAMPAIGN");

#[contract]
pub struct NotesContract;

#[contractimpl]
impl NotesContract {
    // Fungsi untuk mendapatkan semua notes
    pub fn get_campaigns(env: Env) -> Vec<Campaign> {
        // 1. ambil data notes dari storage
        return env.storage().instance().get(&CAMPAIGN_DATA).unwrap_or(Vec::new(&env));
    }

    // Fungsi untuk membuat note baru
    pub fn create_campaign(
        env: Env,
        title: String, 
        description: String,
        target: u64,
        deadline: u64,
        owner: Address,
    ) -> String {
        // 1. ambil data notes dari storage
        let mut campaigns: Vec<Campaign> = 
        env.storage().instance().get(&CAMPAIGN_DATA).unwrap_or(Vec::new(&env));

        let campaign = Campaign {
            id: env.prng().gen::<u64>(),
            title,
            description,
            target,
            raised: 0,
            owner,
            deadline,
        };

        campaigns.push_back(campaign);
        env.storage().instance().set(&CAMPAIGN_DATA, &campaigns);

        String::from_str(&env, "Campaign created")
    }

    pub fn donate(env: Env, id: u64, amount: u64) -> String {
        let mut campaigns: Vec<Campaign> =
            env.storage().instance().get(&CAMPAIGN_DATA).unwrap_or(Vec::new(&env));

        for i in 0..campaigns.len() {
            let mut campaign = campaigns.get(i).unwrap();

            if campaign.id == id {
                campaign.raised += amount;

                campaigns.set(i, campaign);
                env.storage().instance().set(&CAMPAIGN_DATA, &campaigns);

                return String::from_str(&env, "Donation successful");
            }
        }

        String::from_str(&env, "Campaign not found")
    }

    // Fungsi untuk menghapus campaign berdasarkan id
    pub fn delete_campaign(env: Env, id: u64) -> String {
        let mut campaigns: Vec<Campaign> =
            env.storage().instance().get(&CAMPAIGN_DATA).unwrap_or(Vec::new(&env));

        for i in 0..campaigns.len() {
            if campaigns.get(i).unwrap().id == id {
                campaigns.remove(i);

                env.storage().instance().set(&CAMPAIGN_DATA, &campaigns);
                return String::from_str(&env, "Deleted");
            }
        }

        String::from_str(&env, "Not found")
    }
}

mod test;













/* --- CONTOH SCRIPT ---

pub fn get_notes(env: Env) -> Vec<Note> {
    // 1. ambil data notes dari storage
    return env.storage().instance().get(&NOTE_DATA).unwrap_or(Vec::new(&env));
}

// Fungsi untuk membuat note baru
pub fn create_note(env: Env, title: String, content: String) -> String {
    // 1. ambil data notes dari storage
    let mut notes: Vec<Note> = env.storage().instance().get(&NOTE_DATA).unwrap_or(Vec::new(&env));
    
    // 2. Buat object note baru
    let note = Note {
        id: env.prng().gen::<u64>(),
        title: title,
        content: content,
    };
    
    // 3. tambahkan note baru ke notes lama
    notes.push_back(note);
    
    // 4. simpan notes ke storage
    env.storage().instance().set(&NOTE_DATA, &notes);
    
    return String::from_str(&env, "Notes berhasil ditambahkan");
}

// Fungsi untuk menghapus notes berdasarkan id
pub fn delete_note(env: Env, id: u64) -> String {
    // 1. ambil data notes dari storage 
    let mut notes: Vec<Note> = env.storage().instance().get(&NOTE_DATA).unwrap_or(Vec::new(&env));

    // 2. cari index note yang akan dihapus menggunakan perulangan
    for i in 0..notes.len() {
        if notes.get(i).unwrap().id == id {
            notes.remove(i);

            env.storage().instance().set(&NOTE_DATA, &notes);
            return String::from_str(&env, "Berhasil hapus notes");
        }
    }

    return String::from_str(&env, "Notes tidak ditemukan")
}


*/