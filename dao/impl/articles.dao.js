const Bluebird = require('bluebird');
const DEFAULT_CONNECTION = Bluebird.promisifyAll(require('../connection/connect'));


class ArticlesDAO {
  constructor(connection) {
    this.tableName = 'articles';
    this.idField = 'id';
    this.connection = connection || DEFAULT_CONNECTION;
  }


  static get instance() {
    return ArticlesDAO._instance || (ArticlesDAO._instance = new ArticlesDAO());
  }

  async likeArticle(id) {
    try {
      const [article] = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE id = ?`,
        values: [id],
      });

      const like = article.like === 0 ? 1 : 0;

      await this.connection.queryAsync({
        sql: `UPDATE ${this.tableName} SET \`like\`= ? WHERE id = ?`,
        values: [like, id],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOne(id) {
    try {
      const [article] = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE id = ?`,
        values: [id],
      });

      return article;
    } catch (err) {
      throw err;
    }
  }

  async addArticles(articles, userId) {
    try {
      await this.connection.queryAsync({
        sql: `DELETE FROM ${this.tableName} 
              WHERE user_id = ? 
              AND \`like\`= 0`,
        values: [userId],
      });

      articles = articles.filter(article => article.urlToImage !== null);

      await Promise.all(articles.map(async (article) => {
        article.description=""
        const { insertId } = await await this.connection.queryAsync({
          sql: `INSERT INTO ${this.tableName} SET ?`,
          values: [article],
        });

        article.id = insertId;
        delete article.user_id;

        return article;
      }));

      return articles;
    } catch (err) {
      throw err;
    }
  }

  async findLiked(userId, page) {
    try {
      let articles = await this.connection.queryAsync({
        sql: `SELECT * FROM ${this.tableName}
              WHERE user_id = ? 
              AND \`like\`= 1
              LIMIT ?, ?`,
        values: [userId, (page - 1) * 10, 10],
      });

      articles = articles.map((article) => {
        delete article.user_id;
        return article;
      });

      return articles;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = ArticlesDAO;
