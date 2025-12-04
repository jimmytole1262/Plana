export interface Issue {
    issue_id: string;
    user_id: string;
    event_id?: string | null;
    title: string;
    description: string;
    created_at: string;
    responses?: {
      response_text: string;
      created_at: Date;
    }[];
  }

  export interface IssueResponse {
    response_id: string;
    issue_id: string;
    admin_id: string;
    response_text: string;
    created_at: string;
  }