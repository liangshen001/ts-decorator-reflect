
import {MakeAnnotationUtil} from "./make-annotation-util";
import {ClassDefinition} from "../type/class-definition";
import {MethodDefinition} from "../type/method-definition";
import {PropertyDefinition} from "../type/property-definition";
import {DecoratorDefinition} from "../type/decorator-definition";
import {ParameterDefinition} from "../type/parameter-definition";
import {Annotation} from "../bean/annotation";

export class ReflectUtil {

    public static classesMap = new Map<Function, ClassDefinition<any>>();

    /**
     *
     * @param decorator
     * @param target
     * @param propertyKey
     * @param parameterIndex
     */
    public static getDecoratorOption<O, T extends Function>(decorator: Annotation<O>, target: T, propertyKey?: string, parameterIndex?: number): O | undefined {
        let decoratorPayloadDefinition;
        const classDefinition = ReflectUtil.getClassDefinition(target);
        if (propertyKey) {
            const methodDefinition = classDefinition.methods.find(i => i.name === propertyKey);
            if (parameterIndex === undefined) {
                decoratorPayloadDefinition = methodDefinition || classDefinition.properties.find(i => i.name === propertyKey);
            } else {
                decoratorPayloadDefinition = methodDefinition?.parameters[parameterIndex];
            }
        } else {
            decoratorPayloadDefinition = classDefinition;
        }

        const decoratorDefinition = decoratorPayloadDefinition?.decorators.find(i => i.type === decorator);
        return decoratorDefinition?.option;
    }

    public static getDefinition<T extends Function>(target: T | Object, propertyKey: string | symbol | undefined, parameterIndex: number): ParameterDefinition | undefined;
    public static getDefinition<T extends Function>(target: T | Object, propertyKey: string | symbol): MethodDefinition | PropertyDefinition | undefined;
    public static getDefinition<T extends Function>(target: T | Object): ClassDefinition<T>;
    public static getDefinition<T extends Function>(target: Object): ClassDefinition<T>;
    public static getDefinition<T extends Function>(target: T | Object, propertyKey?: string | symbol, parameterIndex?: number):
        ClassDefinition<T> | MethodDefinition | PropertyDefinition | ParameterDefinition | undefined {
        const classType = target instanceof Function ? target : target.constructor;
        const classDefinition = this.classesMap.get(classType);
        if (!classDefinition) {
            const classDefinition = ClassDefinition.of(classType);
            this.classesMap.set(classType, classDefinition);
            return classDefinition;
        }
        if (propertyKey === undefined) {
            if (parameterIndex === undefined) {
                return classDefinition;
            } else {
                return classDefinition.parameters && classDefinition.parameters[parameterIndex];
            }
        }
        const methodDefinition = classDefinition.methods.find(i => i.name === propertyKey);
        if (parameterIndex === undefined) {
            return methodDefinition || classDefinition.properties.find(i => i.name === propertyKey)
        }
        return methodDefinition?.parameters[parameterIndex];
    }

    public static getClassDefinition<T extends Function>(target: T): ClassDefinition<T> {
        return this.getDefinition(target);
    }

    public static getMethodDefinition<T extends Function>(target: T, name: string): MethodDefinition | undefined {
        let definition = this.getDefinition(target, name);
        return <MethodDefinition> definition;
    }

    public static getParameterDefinitionForClass<T extends Function>(target: T, index: number): ParameterDefinition | undefined {
        return this.getDefinition(target, undefined, index)
    }

    public static getPropertyDefinition<T extends Function>(target: T, name: string): PropertyDefinition | undefined {
        let definition = this.getDefinition(target, name);
        return <PropertyDefinition> definition;
    }

    public static getParameterDefinitionForMethod<T extends Function>(target: T, name: string, index: number): ParameterDefinition | undefined {
        return this.getDefinition(target, name, index);
    }

    public static getDecoratorDefinitionForClass<T extends Function>(target: T, decorator: Function): DecoratorDefinition | undefined {
        let classDefinition = ReflectUtil.getDefinition(target);
        return classDefinition.decorators.find(i => i.type === decorator);
    }

    public static getDecoratorDefinitionForMethod<T extends Function>(target: T, name: string, decorator: Function): DecoratorDefinition | undefined {
        let methodDefinition = ReflectUtil.getDefinition(target, name);
        return methodDefinition?.decorators.find(i => i.type === decorator);
    }

    public static getDecoratorDefinitionForProperty<T extends Function>(target: T, name: string, decorator: Function): DecoratorDefinition | undefined {
        let methodDefinition = ReflectUtil.getDefinition(target, name);
        return methodDefinition?.decorators.find(i => i.type === decorator);
    }

    public static getDecoratorDefinitionForMethodParameter<T extends Function>(target: T, name: string, index: number, decorator: Function): DecoratorDefinition | undefined {
        let parameterDefinitionForMethod = ReflectUtil.getDefinition(target, name, index);
        return parameterDefinitionForMethod?.decorators.find(i => i.type === decorator);
    }

    public static getAnnotationDefinitionForClassParameter<T extends Function>(target: T, index: number, decorator: Function): DecoratorDefinition | undefined {
        let parameterDefinitionForClass = ReflectUtil.getDefinition(target, undefined, index);
        return parameterDefinitionForClass?.decorators.find(i => i.type === decorator);
    }
}

