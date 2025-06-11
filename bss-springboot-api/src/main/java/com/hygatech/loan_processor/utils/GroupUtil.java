package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.GroupDto;
import com.hygatech.loan_processor.entities.Group;
import com.hygatech.loan_processor.repositories.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.util.Optional;

@RequiredArgsConstructor
public class GroupUtil {
    private final GroupRepository repository;

    public static Group toEntity(GroupDto dto){
        Group group = new Group();
        BeanUtils.copyProperties(dto, group);
        return group;
    }

    public static GroupDto toDto(Group group){
        GroupDto dto = new GroupDto();
        BeanUtils.copyProperties(group, dto);
        if (group.getMembers() != null){
            dto.setMembers(group.getMembers());
        }

        return dto;
    }




}
