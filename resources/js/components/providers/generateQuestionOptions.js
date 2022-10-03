import { Checkbox, DatePicker, Input, InputNumber, Radio, Select } from "antd";
import React from "react";
export function generateQuestionOptions(question) {
    let question_input;
    switch (question.question_type) {
        case "text":
            question_input = <Input />;
            break;
        case "number":
            question_input = (
                <InputNumber
                    formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                />
            );
            break;
        case "radio":
            // question_input = <Input />;
            let radio_options = [];
            question.question_options.map((question_option, key) => {
                radio_options.push(
                    <Radio
                        key={`question_option_key_${question_option.id}`}
                        value={question_option.option}
                    >
                        {question_option.option}
                    </Radio>
                );
            });
            question_input = <Radio.Group>{radio_options}</Radio.Group>;
            break;

        case "checkbox":
            // question_input = <Input />;
            let checkbox_options = [];
            question.question_options.map((question_option, key) => {
                checkbox_options.push({
                    label: question_option.option,
                    value: question_option.option
                });
            });
            question_input = <Checkbox.Group options={checkbox_options} />;
            break;
        case "select":
            // question_input = <Input />;
            let select_options = [];
            question.question_options.map((question_option, key) => {
                select_options.push(
                    <Select.Option
                        key={`question_option_key_${question_option.id}`}
                        value={question_option.option}
                    >
                        {question_option.option}
                    </Select.Option>
                );
            });
            question_input = (
                <Select
                    showSearch
                    filterOption={(input, option) =>
                        option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                    style={{
                        width: "100%"
                    }}
                >
                    {select_options}
                </Select>
            );
            break;
        case "date":
            question_input = <DatePicker />;

            break;

        default:
            break;
    }

    return question_input;
}
