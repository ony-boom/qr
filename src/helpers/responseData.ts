export interface ResponseForm<T> {
  status: string;
  message?: string;
  data: T;
}

export interface IdDataResult {
  id: string;
  points: number;
}
