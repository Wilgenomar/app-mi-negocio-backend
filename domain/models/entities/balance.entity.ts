export class Balance {
  id!: number;
  constructor(
    public amount: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
