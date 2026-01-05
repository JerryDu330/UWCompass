from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import List

@dataclass(frozen=True)
class Ref: 
    code: str
    url: str

@dataclass(frozen=True)
class Ref_grade:
    code: str
    min_grade: int

class Context:
    def __init__(self, courses: List[Ref], programs: List[Ref], level: str, grades: List[Ref_grade]):
        """
        courses: [Ref("CS 145", "some_random_link1"), Ref("MATH 145", "some_random_link2")]
        programs: Ref("Computer Science")
        level: "1B"
        grades: [Ref_grade("CS 145", 100), Ref_grade("Math 145", 100)]
        """
        self.courses = courses
        self.programs = programs
        self.level = level
        self.grades = grades

    
    def has_course(self, course: Ref) -> bool:
        return course in self.courses
    
    def has_program(self, program: Ref) -> bool:
        return program in self.programs


class NodeType(Enum):
    pass

class LogicType(NodeType):
    AND = "AND"
    OR = "OR"
    NOT = "NOT"

class RuleType(NodeType):
    COURSE = "COURSE"
    PROGRAM = "PROGRAM"
    GRADE = "GRADE"
    LEVEL = "LEVEL"
    OTHER = "OTHER"




class Node(ABC):
    type: NodeType

    @abstractmethod
    def satisfies(self, ctx: Context) -> bool:
        pass

    def get_type_value(self) -> str:
        return self.type.value
    
    def get_nodetype(self) -> str:  # LogicType or RuleType
        return type(self.type).__name__


@dataclass
class Logic(Node):
    type: LogicType
    nodes: List[Node] = field(default_factory=list)


    def satisfies(self, ctx: Context) -> bool:
        if self.type is LogicType.AND:
            return all(n.satisfies(ctx) for n in self.nodes)
        
        elif self.type is LogicType.OR:
            return any(n.satisfies(ctx) for n in self.nodes)
        
        elif self.type is LogicType.NOT:
            return all(not n.satisfies(ctx) for n in self.nodes)
        
        raise ValueError("Unknown LogicType")
    
    
    def get_children(self) -> List[Node]:
        return self.nodes
    


class CourseStatus(Enum):
    COMPLETED = "COMPLETED"
    IN_PROGRESS = "IN_PROGRESS"
    NOT_TAKEN = "NOT_TAKEN"


class Rule(Node, ABC):
    pass

@dataclass
class CourseRule(Rule):
    type: RuleType
    course: Ref
    course_status: CourseStatus

    def satisfies(self, ctx: Context) -> bool:
        return ctx.has_course(self.course)


        
@dataclass
class ProgramRule(Rule):
    type: RuleType
    program: Ref

    def satisfies(self, ctx: Context) -> bool:
        return ctx.has_program(self.program)


@dataclass
class LevelRule(Rule):
    type: RuleType
    level: str

    def satisfies(self, ctx: Context) -> bool:
        try:
            return (int(ctx.level[0]) > int(self.level[0]) or
                     (int(ctx.level[0]) == int(self.level[0]) and ctx.level[1] >= self.level[1]))
        except Exception as e:
            raise "Error: {e}"
            


@dataclass
class GradeRule(Rule):
    type: RuleType
    grade: Ref_grade

    def satisfies(self, ctx: Context) -> bool:
        pass


@dataclass
class OtherRule(Rule):
    type: RuleType
    content: List[str]

    def satisfies(self, ctx: Context) -> bool:
        return True


#course_rule = CourseRule(RuleType.COURSE, Ref("CS145", "LINK"), CourseStatus.COMPLETED)
#print(course_rule.get_nodetype())