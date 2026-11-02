interface Pass {
    id: number;
    name: string;
    document: string;
    issued_at: Date;
    status: 'ACTIVE' | 'CANCELLED';
}