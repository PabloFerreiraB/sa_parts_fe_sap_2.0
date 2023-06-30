export class StringUtils {
  /**
   * Faz sanitize das strings dentro de um objeto, removendo espaços duplos e removendo espaços no início e fim dos textos.
   *
   * @param {Object} [obj={}] - O objeto que sofrerá o sanitize.
   * @returns {Object} O objeto tratado.
   */
  static deepObjectTrim(obj: Record<string, any>): Record<string, any> {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]?.replace(/  +/g, ' ');
        obj[key] = obj[key]?.trim();
        continue;
      }

      if (typeof obj[key] === 'object') {
        this.deepObjectTrim(obj[key]);
      }
    }

    return obj;
  }
}
