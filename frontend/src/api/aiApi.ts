import api from './axios'

// =========================
// REQUEST
// =========================

export interface AiTaskBreakdownRequest {
  taskDescription: string
}


// =========================
// RESPONSE
// =========================

export interface AiTaskBreakdownResponse {
  subtasks: string[]
}


// =========================
// GENERATE TASK BREAKDOWN
// =========================

export const generateTaskBreakdown =
  async (
    request:
      AiTaskBreakdownRequest
  ): Promise<
    AiTaskBreakdownResponse
  > => {

    const response =
      await api.post<
        AiTaskBreakdownResponse
      >(
        '/ai/task-breakdown',
        request
      )

    return response.data
  }