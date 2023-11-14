package com.veterinaria.services.Impl;

import com.veterinaria.entities.RoleEntity;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.repositories.RoleRepository;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.services.UserEntityService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserEntityServiceImpl implements UserEntityService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public UserEntity getUserByPhone(String phone) {
        return userRepository.findByPhone(phone).orElse(null);
    }

    public UserEntity updateUser(Optional<UserEntity> userEntity) {
        userEntity.get().setPassword(new BCryptPasswordEncoder().encode(userEntity.get().getPassword()));
        Set<RoleEntity> roles = userEntity.get().getRoles();
        roleRepository.save(roles.stream().reduce((role1, role2) -> role1).get());
        return userRepository.save(userEntity.get());
    }


    public List<UserEntity> getAllUsersByRoles(String role) {
        List<UserEntity> listUsers = userRepository.findAll();
        List<UserEntity> listUsersRoles = new ArrayList<>();
        listUsers.stream().forEach(userEntity -> {
            userEntity.getRoles().forEach(rol -> {
                System.out.println(rol.getName());
                if (rol.getName().toString().equals(role)) {
                    listUsersRoles.add(userEntity);
                }
            });
        });
        return listUsersRoles;
    }

    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public UserEntity getUserByPetId(Long id) {
        return userRepository.findByPetId(id).orElse(null);
    }

}
