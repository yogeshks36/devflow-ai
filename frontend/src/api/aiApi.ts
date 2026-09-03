import api from './axios'


export interface AiTaskBreakdownRequest {

  taskDescription:
    string

}


export interface AiTaskBreakdownResponse {

  subtasks:
    string[]

}


export const generateTaskBreakdown =
  async (

    request:
      AiTaskBreakdownRequest

  ) => {

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