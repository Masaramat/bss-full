package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.GroupDto;
import com.hygatech.loan_processor.entities.Group;
import com.hygatech.loan_processor.repositories.GroupRepository;
import com.hygatech.loan_processor.utils.GroupUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Stream;

@Service
@Transactional
@RequiredArgsConstructor
public class GroupService {
    private final GroupRepository repository;

    public GroupDto create(GroupDto groupDto){
        Group group = GroupUtil.toEntity(groupDto);
        group.setNumberOfMembers(0);

        return GroupUtil.toDto(repository.save(group));
    }

    public Stream<GroupDto> all(){
        return repository.findAll().stream().map(GroupUtil::toDto);
    }

    public GroupDto find(Long id){
        return GroupUtil.toDto(getGroup(id));
    }

    private Group getGroup(Long groupId){
        Optional<Group> group = repository.findById(groupId);
        if (group.isEmpty()){
            throw new RuntimeException("Group nt found");
        }

        return group.get();
    }
}
