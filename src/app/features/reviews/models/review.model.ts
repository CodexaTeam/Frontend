export class Review {
  public userName?: string;
  public date: Date;

  constructor(
    public id: number,
    public vehicleId: number,
    public userId: number,
    public rating: number,
    public comment: string
  ) {
    this.date = new Date();
  }
}
