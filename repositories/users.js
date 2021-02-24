const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		return JSON.parse(await fs.promises.readFile(this.filename, {
			encoding: 'utf8'
		}));
	}
	async create(att) {
		att.id = this.randomid();
		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(att.password, salt,64);
		const records = await this.getAll();
		const record = {
			...att,
			password: `${buf.toString('hex')}.${salt}`
		};
		records.push(record);
		await this.writeall(records);
		return record;
	}
	async comparepass(saved,supplied){
		const [hashed, salt]= saved.split('.');
		const hashedsupp = await scrypt(supplied,salt,64);
		return hashed === hashedsupp.toString('hex');
	}
	async writeall(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
	}
	randomid(){
		return crypto.randomBytes(4).toString('hex');
	}
	async getone(id){
		const records = await this.getAll();
		return records.find(records => records.id === id )
	}
	async delete(id){
		const records = await this.getAll();
		const Frecords = records.filter( record => record.id !== id);
		await this.writeall(Frecords);
	}
	async update(id, att){
		const records = await this.getAll();
		const record = records.find(record=> record.id === id);
		if (!record){
			throw new Error(`record ${id} not found`);
		}
		Object.assign(record,att);
		await this.writeall(records);
	}
	async getoneby(filters){
		const records = await this.getAll();
		for (let record of records ){
			let found = true ;
			for (let key in filters){
				if (record[key] !== filters[key]){
					found = false;
				}
			}
			if (found ){
				return record;
			}
		}
	}
}

module.exports = new UsersRepository('users.json');
