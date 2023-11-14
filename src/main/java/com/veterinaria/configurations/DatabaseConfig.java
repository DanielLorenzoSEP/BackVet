package com.veterinaria.configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig {

    @Autowired
    private Environment env;

    public String getDatabaseUsername() {
        return env.getProperty("SPRING_DATASOURCE_URL");
    }

    public String getDatabasePassword() {
        return env.getProperty("SPRING_DATASOURCE_PASSWORD");
    }


}
