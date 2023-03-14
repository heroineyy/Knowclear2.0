package com.miniapp.knowclear.config;

import com.github.xiaoymin.knife4j.spring.annotations.EnableKnife4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@EnableKnife4j
@Profile("dev")
public class SwaggerConfig {
    /**
     * 创建API应用 apiInfo() 增加API相关信息
     * 通过select()函数返回一个ApiSelectorBuilder实例,用来控制哪些接口暴露给Swagger来展现，
     * 本例采用指定扫描的包路径来定义指定要建立API的目录。
     */
    @Bean
    public Docket createRestApi() {

        return new Docket(DocumentationType.SWAGGER_2)
                //接口说明信息
                .apiInfo(apiInfo())
                // 选择那些路径和api会生成document
                .pathMapping("/").select()
                // 对所有api进行监控
                .apis(RequestHandlerSelectors.any())
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class)).build();
    }


    /**
     * 创建该API的基本信息（这些基本信息会展现在文档页面中）
     *
     * @return
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("konclear小程序后端测试接口文档")
                .contact(new Contact("heroineyy","https://150.158.6.171","93510710@qq.com"))
                .termsOfServiceUrl("https://150.158.6.171")
                .description("测试接口文档")
                .version("1.0")
                .build();
    }

}