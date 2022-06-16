interface ResponseForm<T> {
  status: string;
  message?: string;
  data: T;
}

export default ResponseForm;