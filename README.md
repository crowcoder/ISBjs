ISBjs
=====
Interactive Search Builder for javascript is a drop-in "widget" that gives your end users the power to construct simple or complex queries. ISBjs does not interact with your data store, but it does provide an intuitive UI that generates a configurable "WHERE" clause suitable for use in your backend. It supports three different styles of parsing:
Parse to dynamic Linq - this parse method returns two strings. One is the expression that is passed to a dynamic linq query,and the other is the parameter list expected by the query.
Parse to SQL - Not using Linq? You can also parse to a standard SQL clause for use in general querying/procedures.
Parse to PostFix - The search expression in postfix notation to facilitate chaining your own expression trees in .Net or any language that supports such constructs.
