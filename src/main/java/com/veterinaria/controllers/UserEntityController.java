package com.veterinaria.controllers;

import com.veterinaria.controllers.request.BooleanDTO;
import com.veterinaria.controllers.request.UpdateUserDTO;
import com.veterinaria.controllers.request.UpdateUserPassDTO;
import com.veterinaria.entities.ERole;
import com.veterinaria.entities.RoleEntity;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.services.UserEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class UserEntityController {

    @Autowired
    UserEntityService userEntityService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/")
    public List<UserEntity> getAllUsers() {
        return userEntityService.getAllUsers();
    }

    @PutMapping("/update")
    public UserEntity updateUser(@RequestBody UpdateUserPassDTO updateUserPassDTO) {
        UserEntity userEntity = userEntityService.getUserByEmail(updateUserPassDTO.getEmail());
        assert userEntity != null;
        userEntity.setPassword(updateUserPassDTO.getPassword());
        return userEntityService.updateUser(Optional.of(userEntity));
    }

    @PutMapping("/update/user")
    public UserEntity updateAllUser(@RequestBody UpdateUserDTO updateUserDTO) {
        System.out.println(updateUserDTO);
        Optional<UserEntity> userEntity = userRepository.findById((long) updateUserDTO.getId());
        assert userEntity.isPresent();
        userEntity.get().setUsername(updateUserDTO.getUsername());
        userEntity.get().setEmail(updateUserDTO.getEmail());
        userEntity.get().setPhone(updateUserDTO.getPhone());
        userEntity.get().setAddress(updateUserDTO.getAddress());
        return userEntityService.updateUser(userEntity);
    }

    @PutMapping("/updatetoadmin")
    public UpdateUserDTO updateUser(@RequestBody UpdateUserDTO updateUserDTO) {
        UserEntity userEntity = userEntityService.getUserByUsername(updateUserDTO.getUsername());
        assert userEntity != null;
        RoleEntity role = userEntity.getRoles().stream().reduce((role1, role2) -> role1).get();
        role.setName(ERole.valueOf("ADMIN"));
        userRepository.save(userEntity);
        return updateUserDTO;
    }

    @PutMapping("/updatetoemployee")
    public UpdateUserDTO updateToEmployee(@RequestBody UpdateUserDTO updateUserDTO) {
        UserEntity userEntity = userEntityService.getUserByUsername(updateUserDTO.getUsername());
        assert userEntity != null;
        RoleEntity role = userEntity.getRoles().stream().reduce((role1, role2) -> role1).get();
        role.setName(ERole.valueOf("EMPLOYEE"));
        userRepository.save(userEntity);
        return updateUserDTO;
    }

    @PutMapping("/updatetouser")
    public UpdateUserDTO updateToUser(@RequestBody UpdateUserDTO updateUserDTO) {
        UserEntity userEntity = userEntityService.getUserByUsername(updateUserDTO.getUsername());
        assert userEntity != null;
        RoleEntity role = userEntity.getRoles().stream().reduce((role1, role2) -> role1).get();
        role.setName(ERole.valueOf("USER"));
        userRepository.save(userEntity);
        return updateUserDTO;
    }

    @GetMapping("/user/username/{username}")
    public UserEntity getUserByUsername(@PathVariable String username) {
        return userEntityService.getUserByUsername(username);
    }

    @GetMapping("/roles/{role}")
    public List<UserEntity> getAllUsersByRole(@PathVariable String role) {
        return userEntityService.getAllUsersByRoles(role);
    }

    @GetMapping("/user/email/{email}")
    public UserEntity getUserByEmail(@PathVariable String email) {
        return userEntityService.getUserByEmail(email);
    }

    @GetMapping("/user/phone/{phone}")
    public UserEntity getUserByPhone(@PathVariable String phone) {
        return userEntityService.getUserByPhone(phone);
    }

    @GetMapping("/user/pet/{id}")
    public UserEntity getUserByPetId(@PathVariable int id) {
        return userEntityService.getUserByPetId((long) id);
    }

    @GetMapping("/exists/username/{username}")
    public BooleanDTO existsByUsername(@PathVariable String username) {
        BooleanDTO booleanDTO = new BooleanDTO();
        booleanDTO.setValue(userEntityService.getUserByUsername(username) != null);
        return booleanDTO;
    }

    @GetMapping("/exists/email/{email}")
    public BooleanDTO existsByEmail(@PathVariable String email) {
        BooleanDTO booleanDTO = new BooleanDTO();
        booleanDTO.setValue(userEntityService.getUserByEmail(email) != null);
        return booleanDTO;
    }

    @GetMapping("/exists/phone/{phone}")
    public BooleanDTO existsByPhone(@PathVariable String phone) {
        BooleanDTO booleanDTO = new BooleanDTO();
        booleanDTO.setValue(userEntityService.getUserByPhone(phone) != null);
        return booleanDTO;
    }

}
