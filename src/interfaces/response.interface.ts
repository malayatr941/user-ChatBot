interface ESResponse {
  error: boolean;
  data: object;
  message: string;
  status: number;
}
interface ESdomain {
  domain: string;
  ip: string;
  ping: boolean;
  ping_time: number;
  success: boolean;
  online: boolean;
  statusCode: number;
}

export { ESResponse, ESdomain };
