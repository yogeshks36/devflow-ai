import api from './axios'


// =========================
// REQUEST TYPE
// =========================

export interface AiTaskBreakdownRequest {

  taskDescription:
    string

}


// =========================
// RESPONSE TYPE
// =========================

export interface AiTaskBreakdownResponse {

  subtasks:
    string[]

}


// =========================
// GENERATE AI BREAKDOWN
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