import api from './axios'


// =========================
// REQUEST
// =========================

export interface AiTaskBreakdownRequest {

  projectId: number

  title: string

  description: string

}


// =========================
// AI STEP
// =========================

export interface AiTaskStep {

  title: string

  description: string

}


// =========================
// RESPONSE
// =========================

export interface AiTaskBreakdownResponse {

  steps: AiTaskStep[]

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