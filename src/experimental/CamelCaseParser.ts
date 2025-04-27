export class CamelCaseParser {
  private array: Array<string> = [];

  public constructor(private string: string) {
    this.setString(string);
  }

  public static splitString(string: string) {
    return string.split(/(?=[A-Z])/);
  }

  public static toCamelCase(...array: (string | unknown)[]) {
    array = array.filter((value) => typeof value === "string" && value.length);

    if (array.length === 0) {
      return "";
    }
    const stringArray: string[] = array as string[];

    array[0] = CamelCaseParser.firstLetterLowercase(stringArray[0]);

    for (let i = 1; i < array.length; i++) {
      array[i] = CamelCaseParser.firstLetterUppercase(stringArray[i]);
    }

    return array.join("");
  }

  public static firstLetterLowercase(string: string) {
    return string.length ? string[0].toLowerCase() + string.substring(1) : "";
  }

  public static firstLetterUppercase(string: string) {
    return string[0].toUpperCase() + string.substring(1);
  }

  public setString(string: string) {
    this.array = CamelCaseParser.splitString(string);
    this.string = string;
    return this;
  }

  public getString() {
    return this.string;
  }

  public first() {
    return this.array[0];
  }

  public last() {
    return this.array[this.array.length - 1] ?? "";
  }

  public toArray() {
    return this.array.slice();
  }
}
