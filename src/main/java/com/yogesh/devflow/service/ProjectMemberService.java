package com.yogesh.devflow.service;

import java.util.List;

import com.yogesh.devflow.dto.request.AddProjectMemberRequest;
import com.yogesh.devflow.dto.response.ProjectMemberResponse;

public interface ProjectMemberService {

    ProjectMemberResponse addMember(
            String ownerEmail,
            Long projectId,
            AddProjectMemberRequest request);

    List<ProjectMemberResponse> getMembers(
            String ownerEmail,
            Long projectId);

    void removeMember(
            String ownerEmail,
            Long projectId,
            Long userId);
}