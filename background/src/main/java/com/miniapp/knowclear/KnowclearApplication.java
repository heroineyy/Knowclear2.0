package com.miniapp.knowclear;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.miniapp.knowclear.mapper")
public class KnowclearApplication {
	public static void main(String[] args) {
		SpringApplication.run(KnowclearApplication.class, args);
	}

}
