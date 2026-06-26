export type Trip = {
  id: string;
  owner_user_id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  description: string | null;
  timezone: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  version: number;
};

export type CreateTripInput = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  timezone?: string;
};