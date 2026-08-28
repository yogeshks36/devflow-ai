import api from './axios'


// =========================
// TYPES
// =========================

export interface ProjectMember {

  id: number

  userId: number

  firstName: string

  lastName: string

  email: string
}


export interface AddProjectMemberRequest {

  email: string
}


// =========================
// GET PROJECT MEMBERS
// =========================

export const getProjectMembers = async (
  projectId: number
): Promise<ProjectMember[]> => {

  const response =
    await api.get<ProjectMember[]>(
      `/projects/${projectId}/members`
    )

  return response.data
}


// =========================
// ADD PROJECT MEMBER
// =========================

export const addProjectMember = async (
  projectId: number,
  data: AddProjectMemberRequest
): Promise<ProjectMember> => {

  const response =
    await api.post<ProjectMember>(
      `/projects/${projectId}/members`,
      data
    )

  return response.data
}


// =========================
// REMOVE PROJECT MEMBER
// =========================

export const removeProjectMember = async (
  projectId: number,
  userId: number
): Promise<void> => {

  await api.delete(
    `/projects/${projectId}/members/${userId}`
  )
}