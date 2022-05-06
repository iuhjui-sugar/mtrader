
export class Session {
    public token:string = "";
    
    public userid:string = "";

    public avatar:string = "";
    
    public nickname:string = "";

    public binds:string[]=[];

    public links:string[]=[];

    public expired:number = 0;

    public created:number = 0;
}
