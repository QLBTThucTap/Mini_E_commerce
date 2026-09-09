const fs = require("fs").promises; //Dùng fs.promises thay vì đồng bộ
const path = require("path");

class JsonCollection {
  //Tạo đường dẫn đến file JSON cùng cấp với thư mục data
  constructor(filename) {
    this.filePath = path.join(__dirname, "..", "data", filename);
  }

  async _read() {
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      if (!raw.trim()) return []; // File rỗng → trả về mảng rỗng
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === "ENOENT") return []; // File chưa tồn tại → trả về []
      throw error;
    }
  }

  async _write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  async findAll() {
    return await this._read();
  }

  async findById(id) {
    const items = await this._read();
    return items.find((item) => item.id === Number(id));
  }

  async create(newItemWithoutId) {
    const items = await this._read();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem = { id: maxId + 1, ...newItemWithoutId };
    items.push(newItem);
    await this._write(items);
    return newItem;
  }

  /** replace: nếu true thì thay toàn bộ object (PUT), false thì merge (PATCH) */
  async updateById(id, patch, { replace = false } = {}) {
    const items = await this._read();
    const index = items.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;

    const updated = replace
      ? { ...patch, id: items[index].id }
      : { ...items[index], ...patch, id: items[index].id };

    items[index] = updated;
    await this._write(items);
    return updated;
  }

  async deleteById(id) {
    const items = await this._read();
    const index = items.findIndex((item) => item.id === Number(id));

    if (index === -1) return null;

    const [deleted] = items.splice(index, 1);
    await this._write(items);

    return deleted;
  }

  // async deleteById(id) {
  //   return this.delete(id);
  // }
}

module.exports = JsonCollection;
