export interface Meal {
    id: number;
    name: string;
    date_add: Date;
    date_lastuse: Date | null;
    counter: number;
    type: number;
    notes: string;
}