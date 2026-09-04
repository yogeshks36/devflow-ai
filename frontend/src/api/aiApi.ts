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

    console.log(
      'AI REQUEST BODY:',
      request
    )


    const response =
      await api.post<
        AiTaskBreakdownResponse
      >(

        '/ai/task-breakdown',

        request

      )


    console.log(
      'AI RESPONSE:',
      response.data
    )


    return response.data

  }