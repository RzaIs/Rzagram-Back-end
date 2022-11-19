
export class PaginatedModel<Type> {
  constructor(
    public page: number,
    public count: number,
    public hasNext: boolean,
    public data: Type
  ) {}
}