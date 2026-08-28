import api from './axios'


// =========================
// PROJECT MEMBER
// =========================

export interface ProjectMember {

  id: number

  userId: number

  firstName: string

  lastName: string

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